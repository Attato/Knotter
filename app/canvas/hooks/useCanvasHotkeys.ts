import { useEffect, useRef, RefObject } from 'react';

import { NODE_MOVE_MAX_STEP } from '@/canvas/constants';
import { Position, CanvasState } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { useCanvasHistory } from '@/canvas/hooks/useCanvasHistory';

import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { handleDeleteItems } from '@/canvas/utils/handleDeleteItems';
import { moveNodes } from '@/canvas/utils/moveNodes';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';
import { getSelectedNodes } from '@/canvas/utils/getSelectedNodes';
import { getSelectedEdges } from '@/canvas/utils/getSelectedEdges';
import { getMousePosition } from '@/canvas/utils/getMousePosition';
import { cloneNodesWithInsertionGap } from '@/canvas/utils/cloneNodesWithInsertionGap ';
import { cloneEdgesForNewNodes } from '@/canvas/utils/cloneEdgesForNewNodes';
import { toggleMagnetMode } from '@/canvas/utils/toggleMagnetMode';

export function useCanvasHotkeys(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const { selectedItemIds, setSelectedItemIds } = useCanvasStore();
    const { pushHistory, undo, redo } = useCanvasHistory();

    const clipboardRef = useRef<CanvasState>({ nodes: [], edges: [] });
    const mousePosRef = useRef<Position>({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const keysPressed = new Set<string>();

        const onMouseMove = (e: MouseEvent) => {
            mousePosRef.current = getMousePosition(e, canvas);
        };

        canvas.addEventListener('mousemove', onMouseMove);

        const handlers = {
            toggleMagnet: () => toggleMagnetMode(),
            toggleGrid: () => useCanvasStore.getState().toggleShowGrid(),
            toggleAxes: () => useCanvasStore.getState().toggleShowAxes(),

            delete: () => {
                const state = useCanvasStore.getState();
                state.setItems(handleDeleteItems(state.items, selectedItemIds));
                state.setSelectedItemIds([]);
            },

            selectAll: () => {
                const state = useCanvasStore.getState();
                const nodeIds = state.items.filter((i) => i.kind === 'node').map((n) => n.id);
                setSelectedItemIds(nodeIds);
            },

            copy: () => {
                const state = useCanvasStore.getState();

                const selectedNodes = getSelectedNodes(state.items, selectedItemIds);
                const selectedEdges = getSelectedEdges(state.items, selectedItemIds);

                clipboardRef.current = { nodes: selectedNodes, edges: selectedEdges };
            },

            paste: () => {
                const state = useCanvasStore.getState();
                const { nodes, edges } = clipboardRef.current;

                if (!nodes.length) return;

                pushHistory();

                const insertionGap = 50;
                const newNodes = cloneNodesWithInsertionGap(nodes, insertionGap);
                const nodeIdMap = new Map(nodes.map((node, i) => [node.id, newNodes[i].id]));
                const newEdges = cloneEdgesForNewNodes(edges, newNodes, nodeIdMap);

                state.setItems([...state.items, ...newNodes, ...newEdges]);
                state.setSelectedItemIds(newNodes.map((n) => n.id));
            },

            addNode: () => {
                const state = useCanvasStore.getState();

                if (!state || !canvas) return;

                pushHistory();

                const mousePos = mousePosRef.current;
                const newNode = handleAddNode(getNodes(state.items), mousePos);

                state.setItems([...state.items, newNode]);
                state.setSelectedItemIds([newNode.id]);
            },

            startEdge: () => {
                const state = useCanvasStore.getState();

                if (selectedItemIds.length === 0) return;

                const nodes = getNodes(state.items);
                const fromNodeId = selectedItemIds[0];
                const fromNode = nodes.find((n) => n.id === fromNodeId);

                if (!fromNode) return;

                state.setTempEdge({ from: fromNodeId, toPos: { ...fromNode.position } });
            },

            moveSelection: (dx: number, dy: number) => {
                const state = useCanvasStore.getState();

                if (selectedItemIds.length === 0) return;

                pushHistory();

                const nodes = getNodes(state.items);
                const edges = getEdges(state.items);

                const initialPositions = new Map<string, Position>();

                nodes.forEach((node) => {
                    if (selectedItemIds.includes(node.id)) {
                        initialPositions.set(node.id, { ...node.position });
                    }
                });

                const movedNodes = moveNodes(nodes, selectedItemIds, initialPositions, { x: dx, y: dy }, 1);
                state.setItems([...movedNodes, ...edges]);
            },
        };

        const onKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const target = e.target as HTMLElement;

            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

            if (keysPressed.has(key)) return;

            keysPressed.add(key);

            const isCtrl = e.ctrlKey || e.metaKey;

            if ((key === 'm' || key === 'ь') && !isCtrl && !e.shiftKey) return handlers.toggleMagnet();
            if ((key === 'g' || key === 'п') && !isCtrl && !e.shiftKey) return handlers.toggleGrid();
            if ((key === 'a' || key === 'ф') && !isCtrl && !e.shiftKey) return handlers.toggleAxes();

            if (key === 'delete') return handlers.delete();

            if ((key === 'a' || key === 'ф') && isCtrl) {
                e.preventDefault();
                return handlers.selectAll();
            }

            if ((key === 'c' || key === 'с') && isCtrl) {
                e.preventDefault();
                return handlers.copy();
            }

            if ((key === 'v' || key === 'м') && isCtrl) {
                e.preventDefault();
                return handlers.paste();
            }

            if ((key === 'z' || key === 'я') && isCtrl) {
                e.preventDefault();
                if (e.shiftKey) return redo();
                return undo();
            }

            if ((key === 'a' || key === 'ф') && e.shiftKey) return handlers.addNode();
            if ((key === 'e' || key === 'у') && e.shiftKey) return handlers.startEdge();

            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
                const step = NODE_MOVE_MAX_STEP;

                if (key === 'arrowup') handlers.moveSelection(0, -step);
                if (key === 'arrowdown') handlers.moveSelection(0, step);
                if (key === 'arrowleft') handlers.moveSelection(-step, 0);
                if (key === 'arrowright') handlers.moveSelection(step, 0);
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            keysPressed.delete(e.key.toLowerCase());
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            canvas.removeEventListener('mousemove', onMouseMove);
        };
    }, [selectedItemIds, setSelectedItemIds, canvasRef, pushHistory, redo, undo]);
}
