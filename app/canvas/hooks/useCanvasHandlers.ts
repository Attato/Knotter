import { useRef } from 'react';
import { CanvasState, Position, NodeShapeType } from '@/canvas/canvas.types';

import { useCanvasHistory } from '@/canvas/hooks/useCanvasHistory';

import { handleAddItem } from '@/canvas/utils/items/handleAddItem';
import { handleDeleteItems } from '@/canvas/utils/items/handleDeleteItems';
import { moveNodes } from '@/canvas/utils/nodes/moveNodes';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';
import { getSelectedNodes } from '@/canvas/utils/nodes/getSelectedNodes';
import { getSelectedEdges } from '@/canvas/utils/edges/getSelectedEdges';
import { cloneNodesWithInsertionGap } from '@/canvas/utils/nodes/cloneNodesWithInsertionGap ';
import { cloneEdgesForNewNodes } from '@/canvas/utils/edges/cloneEdgesForNewNodes';
import { toggleMagnetMode } from '@/canvas/utils/canvas/toggleMagnetMode';
import { toggleTooltipMode } from '@/canvas/utils/canvas/toggleTooltipMode';

import { useCanvasStore } from '@/canvas/store/canvasStore';

export function useCanvasHandlers() {
    const items = useCanvasStore((state) => state.items);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const mousePosition = useCanvasStore((state) => state.mousePosition);
    const setItems = useCanvasStore((state) => state.setItems);
    const setSelectedItemIds = useCanvasStore((state) => state.setSelectedItemIds);
    const setTempEdge = useCanvasStore((state) => state.setTempEdge);
    const toggleFullScreen = useCanvasStore((state) => state.toggleFullScreen);
    const toggleGrid = useCanvasStore((state) => state.toggleShowGrid);
    const toggleAxes = useCanvasStore((state) => state.toggleShowAxes);

    const clipboardRef = useRef<CanvasState>({ nodes: [], edges: [] });

    const { pushHistory } = useCanvasHistory();

    return {
        toggleTooltipMode,
        toggleFullScreen,
        toggleMagnetMode,
        toggleGrid,
        toggleAxes,

        delete: () => {
            const newItems = handleDeleteItems(items, selectedItemIds);
            setItems(newItems);
            setSelectedItemIds([]);
        },

        selectAll: () => setSelectedItemIds(items.map((i) => i.id)),
        selectAllNodes: () => setSelectedItemIds(items.filter((i) => i.kind === 'node').map((n) => n.id)),
        selectAllEdges: () => setSelectedItemIds(items.filter((i) => i.kind === 'edge').map((e) => e.id)),

        copy: () => {
            clipboardRef.current = {
                nodes: getSelectedNodes(items, selectedItemIds),
                edges: getSelectedEdges(items, selectedItemIds),
            };
        },

        paste: () => {
            const { nodes, edges } = clipboardRef.current;
            if (!nodes.length) return;

            pushHistory();

            const insertionGap = 50;
            const existingCount = items.length;

            const newNodes = cloneNodesWithInsertionGap(nodes, insertionGap, existingCount);
            if (!newNodes.length) return;

            const nodeIdMap = new Map(nodes.slice(0, newNodes.length).map((node, i) => [node.id, newNodes[i].id]));

            const newEdges = cloneEdgesForNewNodes(edges, newNodes, nodeIdMap, existingCount + newNodes.length);

            setItems([...items, ...newNodes, ...newEdges]);
            setSelectedItemIds(newNodes.map((n) => n.id));
        },

        addNode: () => {
            pushHistory();

            const newNode = handleAddItem({
                type: 'node',
                state: { nodes: getNodes(items), edges: getEdges(items) },
                position: mousePosition,
            });

            if (!newNode) return;

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

        changeNodeShapeType: (nodeIds: string[], newShape: NodeShapeType) => {
            pushHistory();
            const updatedItems = items.map((i) =>
                i.kind === 'node' && nodeIds.includes(i.id) ? { ...i, shapeType: newShape } : i,
            );
            setItems(updatedItems);
        },
    };
}
