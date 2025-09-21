import { RefObject } from 'react';
import { CanvasState, Position } from '@/canvas/canvas.types';

import { useCanvasHistory } from '@/canvas/hooks/useCanvasHistory';

import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { handleDeleteItems } from '@/canvas/utils/handleDeleteItems';
import { moveNodes } from '@/canvas/utils/moveNodes';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';
import { getSelectedNodes } from '@/canvas/utils/getSelectedNodes';
import { getSelectedEdges } from '@/canvas/utils/getSelectedEdges';
import { cloneNodesWithInsertionGap } from '@/canvas/utils/cloneNodesWithInsertionGap ';
import { cloneEdgesForNewNodes } from '@/canvas/utils/cloneEdgesForNewNodes';
import { toggleMagnetMode } from '@/canvas/utils/toggleMagnetMode';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

export interface CanvasHandlersDeps {
    clipboard: RefObject<CanvasState>;
    mousePos: RefObject<Position>;
}

export function useCanvasHandlers({ clipboard, mousePos }: CanvasHandlersDeps) {
    const { items, setItems, selectedItemIds, setSelectedItemIds, setTempEdge } = useCanvasStore();

    const { pushHistory } = useCanvasHistory();

    return {
        toggleMagnet: toggleMagnetMode,
        toggleGrid: () => useCanvasStore.getState().toggleShowGrid(),
        toggleAxes: () => useCanvasStore.getState().toggleShowAxes(),

        delete: () => {
            const newItems = handleDeleteItems(items, selectedItemIds);
            setItems(newItems);
            setSelectedItemIds([]);
        },

        selectAll: () => {
            const nodeIds = items.filter((i) => i.kind === 'node').map((n) => n.id);
            setSelectedItemIds(nodeIds);
        },

        copy: () => {
            clipboard.current = {
                nodes: getSelectedNodes(items, selectedItemIds),
                edges: getSelectedEdges(items, selectedItemIds),
            };
        },

        paste: () => {
            const { nodes, edges } = clipboard.current;
            if (!nodes.length) return;

            pushHistory();

            const insertionGap = 50;
            const newNodes = cloneNodesWithInsertionGap(nodes, insertionGap);
            const nodeIdMap = new Map(nodes.map((node, i) => [node.id, newNodes[i].id]));
            const newEdges = cloneEdgesForNewNodes(edges, newNodes, nodeIdMap);

            setItems([...items, ...newNodes, ...newEdges]);
            setSelectedItemIds(newNodes.map((n) => n.id));
        },

        addNode: () => {
            pushHistory();
            const newNode = handleAddNode(getNodes(items), mousePos.current);
            setItems([...items, newNode]);
            setSelectedItemIds([newNode.id]);
        },

        startEdge: () => {
            if (!setTempEdge || selectedItemIds.length === 0) return;
            const nodes = getNodes(items);
            const fromNode = nodes.find((n) => n.id === selectedItemIds[0]);
            if (!fromNode) return;

            setTempEdge({ from: fromNode.id, toPos: { ...fromNode.position } });
        },

        moveSelection: (dx: number, dy: number) => {
            if (selectedItemIds.length === 0) return;

            pushHistory();

            const nodes = getNodes(items);
            const edges = getEdges(items);

            const initialPositions = new Map<string, Position>();
            nodes.forEach((node) => {
                if (selectedItemIds.includes(node.id)) {
                    initialPositions.set(node.id, { ...node.position });
                }
            });

            const movedNodes = moveNodes(nodes, selectedItemIds, initialPositions, { x: dx, y: dy }, 1);

            setItems([...movedNodes, ...edges]);
        },
    };
}
