'use client';

import { useCallback, RefObject, useState } from 'react';

import { Position } from '@/canvas/canvas.types';

import { DRAG_THRESHOLD } from '@/canvas/constants';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { getMousePosition } from '@/canvas/utils/getMousePosition';
import { findNodeUnderCursor } from '@/canvas/utils/findNodeUnderCursor';
import { findEdgeUnderCursor } from '@/canvas/utils/findEdgeUnderCursor';
import { selectCanvasItem } from '@/canvas/utils/selectCanvasItem';
import { moveNodes } from '@/canvas/utils/moveNodes';
import { prepareDrag } from '@/canvas/utils/prepareDrag';
import { handleAddItem } from '@/canvas/utils/handleAddItem';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';

export function useCanvasMouseEvents(canvasRef: RefObject<HTMLCanvasElement | null>, isPanningRef?: RefObject<boolean>) {
    const { setItems, nodeMoveStep, tempEdge, setTempEdge, setSelectedItemIds, updateMousePosition } = useCanvasStore();

    const [pendingClickItemId, setPendingClickItemId] = useState<string | null>(null);
    const [dragStartMouse, setDragStartMouse] = useState<Position | null>(null);
    const [isDraggingNodes, setIsDraggingNodes] = useState(false);
    const [initialNodePositions, setInitialNodePositions] = useState<Map<string, Position>>(new Map());

    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas || e.button !== 0) return;

            const mousePos = getMousePosition(e, canvas);
            updateMousePosition(mousePos);

            const { items, selectedItemIds } = useCanvasStore.getState();
            const nodes = getNodes(items);
            const edges = getEdges(items);

            const clickedNode = findNodeUnderCursor(nodes, mousePos);
            const clickedEdge = !clickedNode ? findEdgeUnderCursor(edges, nodes, mousePos) : null;
            if (!clickedNode && !clickedEdge) return;

            const clickedItemId = (clickedNode || clickedEdge)!.id;

            setPendingClickItemId(clickedItemId);
            setDragStartMouse(mousePos);

            if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                if (!selectedItemIds.includes(clickedItemId)) {
                    setSelectedItemIds([clickedItemId]);
                }
            }
        },
        [canvasRef, updateMousePosition, setSelectedItemIds],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const mousePos = getMousePosition(e, canvas);
            updateMousePosition(mousePos);

            if (isPanningRef?.current) return;

            const { items, selectedItemIds } = useCanvasStore.getState();
            const nodes = getNodes(items);

            if (!isDraggingNodes) {
                const hoveredNode = findNodeUnderCursor(nodes, mousePos);
                const edges = getEdges(items);
                const hoveredEdge = !hoveredNode ? findEdgeUnderCursor(edges, nodes, mousePos) : null;

                switch (true) {
                    case !!hoveredNode:
                        canvas.style.cursor = 'move';
                        break;
                    case !!hoveredEdge:
                        canvas.style.cursor = 'pointer';
                        break;
                    default:
                        canvas.style.cursor = 'default';
                }
            }

            if (tempEdge) {
                setTempEdge({ ...tempEdge, toPos: mousePos });
                return;
            }

            if (!isDraggingNodes && pendingClickItemId && dragStartMouse) {
                const dx = mousePos.x - dragStartMouse.x;
                const dy = mousePos.y - dragStartMouse.y;

                if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
                    setIsDraggingNodes(true);
                    setInitialNodePositions(prepareDrag(nodes, selectedItemIds));
                }
            }

            if (isDraggingNodes && dragStartMouse) {
                const dx = mousePos.x - dragStartMouse.x;
                const dy = mousePos.y - dragStartMouse.y;

                const updatedNodes = moveNodes(nodes, selectedItemIds, initialNodePositions, { x: dx, y: dy }, nodeMoveStep);

                const currentItems = useCanvasStore.getState().items;
                setItems(
                    currentItems.map((item) =>
                        item.kind === 'node' && selectedItemIds.includes(item.id)
                            ? (updatedNodes.find((n) => n.id === item.id) ?? item)
                            : item,
                    ),
                );
            }
        },
        [
            canvasRef,
            dragStartMouse,
            initialNodePositions,
            isDraggingNodes,
            nodeMoveStep,
            pendingClickItemId,

            setItems,
            tempEdge,
            setTempEdge,
            updateMousePosition,
            isPanningRef,
        ],
    );

    const onMouseUp = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const mousePos = getMousePosition(e, canvas);
            const { items, selectedItemIds } = useCanvasStore.getState();

            if (!isDraggingNodes && pendingClickItemId) {
                const newSelectedIds = selectCanvasItem({
                    items,
                    selectedIds: selectedItemIds,
                    itemId: pendingClickItemId,
                    event: e,
                });
                setSelectedItemIds(newSelectedIds);
            }

            if (tempEdge) {
                const nodes = getNodes(items);
                const edges = getEdges(items);

                const targetNode = findNodeUnderCursor(nodes, mousePos);
                const edgeExists = targetNode
                    ? edges.some((edge) => edge.from === tempEdge.from && edge.to === targetNode.id)
                    : true;

                if (targetNode && targetNode.id !== tempEdge.from && !edgeExists) {
                    const fromNode = nodes.find((n) => n.id === tempEdge.from);

                    if (fromNode) {
                        const newEdge = handleAddItem({
                            type: 'edge',
                            state: { nodes, edges },
                            fromNode,
                            toNode: targetNode,
                        });

                        if (newEdge) setItems([...items, newEdge]);
                    }
                }

                setTempEdge(null);
            }

            setIsDraggingNodes(false);
            setDragStartMouse(null);
            setPendingClickItemId(null);
            setInitialNodePositions(new Map());

            const hoveredNode = findNodeUnderCursor(getNodes(items), mousePos);
            const hoveredEdge = !hoveredNode ? findEdgeUnderCursor(getEdges(items), getNodes(items), mousePos) : null;

            switch (true) {
                case !!hoveredNode:
                    canvas.style.cursor = 'move';
                    break;
                case !!hoveredEdge:
                    canvas.style.cursor = 'pointer';
                    break;
                default:
                    canvas.style.cursor = 'default';
            }
        },
        [canvasRef, isDraggingNodes, pendingClickItemId, setSelectedItemIds, tempEdge, setTempEdge, setItems],
    );

    return { onMouseDown, onMouseMove, onMouseUp };
}
