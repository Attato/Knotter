import { useEffect, useCallback, useRef } from 'react';

import { NODE_MOVE_MAX_STEP } from '@/canvas/constants';

import { Position, Node, Edge, CanvasState } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { handleAddEdge } from '@/canvas/utils/handleAddEdge';
import { handleDeleteItems } from '@/canvas/utils/handleDeleteItems';
import { moveNodes } from '@/canvas/utils/moveNodes';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';
import { toggleMagnetMode } from '../utils/toggleMagnetMode';

import { v4 as uuidv4 } from 'uuid';

export function useCanvasHotkeys() {
    const { selectedItemIds, setSelectedItemIds } = useCanvasStore();

    const clipboardRef = useRef<CanvasState>({ nodes: [], edges: [] });
    const historyRef = useRef<CanvasState[]>([]);
    const redoRef = useRef<CanvasState[]>([]);

    const pushHistory = useCallback(() => {
        const state = useCanvasStore.getState();
        const nodesOnly = state.items.filter((i): i is Node => i.kind === 'node');
        const edgesOnly = state.items.filter((i): i is Edge => i.kind === 'edge');
        historyRef.current.push({ nodes: nodesOnly, edges: edgesOnly });

        redoRef.current = [];
    }, []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const state = useCanvasStore.getState();
            const currentItems = state.items;

            const target = e.target as HTMLElement;

            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

            if ((key === 'm' || key === 'ь') && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                toggleMagnetMode();
                return;
            }

            if ((key === 'g' || key === 'п') && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                state.toggleShowGrid();
                return;
            }

            if ((key === 'a' || key === 'ф') && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                state.toggleShowAxes();
                return;
            }

            if (key === 'delete') {
                e.preventDefault();
                const newItems = handleDeleteItems(state.items, selectedItemIds);
                state.setItems(newItems);
                state.setSelectedItemIds([]);
            }

            if ((key === 'a' || key === 'ф') && e.ctrlKey) {
                e.preventDefault();
                const nodeIds = currentItems.filter((i) => i.kind === 'node').map((n) => n.id);
                setSelectedItemIds(nodeIds);
                return;
            }

            if ((key === 'c' || key === 'с') && e.ctrlKey) {
                e.preventDefault();
                const selectedNodes = currentItems.filter(
                    (i) => i.kind === 'node' && selectedItemIds.includes(i.id),
                ) as Node[];
                const selectedEdges = currentItems.filter(
                    (i) => i.kind === 'edge' && selectedItemIds.includes(i.from) && selectedItemIds.includes(i.to),
                ) as Edge[];
                clipboardRef.current = { nodes: selectedNodes, edges: selectedEdges };
                return;
            }

            if ((key === 'v' || key === 'м') && e.ctrlKey) {
                e.preventDefault();
                const { nodes: clipboardNodes, edges: clipboardEdges } = clipboardRef.current;
                if (!clipboardNodes.length) return;

                pushHistory();

                const offset = 50;
                const newNodes: Node[] = clipboardNodes.map((node) => ({
                    ...node,
                    id: uuidv4(),
                    position: { x: node.position.x + offset, y: node.position.y + offset },
                }));

                const nodeIdMap = new Map(clipboardNodes.map((node, i) => [node.id, newNodes[i].id]));

                const newEdges: Edge[] = clipboardEdges.flatMap((edge) => {
                    const fromNode = newNodes.find((n) => n.id === nodeIdMap.get(edge.from));
                    const toNode = newNodes.find((n) => n.id === nodeIdMap.get(edge.to));
                    if (!fromNode || !toNode) return [];
                    return handleAddEdge([], fromNode, toNode);
                });

                state.setItems([...currentItems, ...newNodes, ...newEdges]);
                state.setSelectedItemIds(newNodes.map((n) => n.id));
                return;
            }

            if ((key === 'z' || key === 'я') && e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                const lastState = historyRef.current.pop();
                if (lastState) {
                    redoRef.current.push({
                        nodes: getNodes(state.items),
                        edges: getEdges(state.items),
                    });
                    state.setItems([...lastState.nodes, ...lastState.edges]);
                    state.setSelectedItemIds([]);
                }
                return;
            }

            if ((key === 'z' || key === 'я') && e.ctrlKey && e.shiftKey) {
                e.preventDefault();
                const redoState = redoRef.current.pop();
                if (redoState) {
                    historyRef.current.push({
                        nodes: getNodes(state.items),
                        edges: getEdges(state.items),
                    });
                    state.setItems([...redoState.nodes, ...redoState.edges]);
                    state.setSelectedItemIds([]);
                }
                return;
            }

            if ((key === 'a' || key === 'ф') && e.shiftKey) {
                e.preventDefault();
                if (e.repeat) return;

                pushHistory();

                const nodesOnly: Node[] = getNodes(currentItems);
                const newNode: Node = handleAddNode(nodesOnly);

                state.setItems([...currentItems, newNode]);
                state.setSelectedItemIds([newNode.id]);

                return;
            }

            if ((key === 'e' || key === 'у') && e.shiftKey) {
                e.preventDefault();
                if (selectedItemIds.length === 0) return;

                const nodesOnly: Node[] = getNodes(currentItems);
                const fromNodeId = selectedItemIds[0];
                const fromNode = nodesOnly.find((n) => n.id === fromNodeId);

                if (!fromNode) return;

                state.setTempEdge({ from: fromNodeId, toPos: { ...fromNode.position } });
                return;
            }

            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
                e.preventDefault();

                const step = NODE_MOVE_MAX_STEP;
                let dx = 0,
                    dy = 0;

                if (key === 'arrowup') dy = -step;
                if (key === 'arrowdown') dy = step;
                if (key === 'arrowleft') dx = -step;
                if (key === 'arrowright') dx = step;

                if (selectedItemIds.length > 0) {
                    pushHistory();

                    const nodesOnly = getNodes(currentItems);
                    const edgesOnly = getEdges(currentItems);

                    const initialPositions = new Map<string, Position>();
                    nodesOnly.forEach((node) => {
                        if (selectedItemIds.includes(node.id)) initialPositions.set(node.id, { ...node.position });
                    });

                    const movedNodes = moveNodes(nodesOnly, selectedItemIds, initialPositions, { x: dx, y: dy }, 1);
                    state.setItems([...movedNodes, ...edgesOnly]);
                }
                return;
            }
        },
        [selectedItemIds, setSelectedItemIds, pushHistory],
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
