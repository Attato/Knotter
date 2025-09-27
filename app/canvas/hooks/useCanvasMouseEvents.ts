'use client';

import { useCallback, RefObject, useState } from 'react';
import { Position } from '@/canvas/canvas.types';
import { getMousePosition } from '@/canvas/utils/getMousePosition';
import { findNodeUnderCursor } from '@/canvas/utils/findNodeUnderCursor';
import { findEdgeUnderCursor } from '@/canvas/utils/findEdgeUnderCursor';
import { selectCanvasItem } from '@/canvas/utils/selectCanvasItem';
import { moveNodes } from '@/canvas/utils/moveNodes';
import { prepareDrag } from '@/canvas/utils/prepareDrag';
import { handleAddItem } from '@/canvas/utils/handleAddItem';
import { handleOpenInspector } from '@/canvas/utils/handleOpenInspector';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export function useCanvasMouseEvents(canvasRef: RefObject<HTMLCanvasElement | null>, isPanningRef?: RefObject<boolean>) {
    const { setItems, nodeMoveStep, tempEdge, setTempEdge, selectedItemIds, setSelectedItemIds, updateMousePosition } =
        useCanvasStore();

    const [isDraggingNodes, setIsDraggingNodes] = useState(false);
    const [dragStartMouse, setDragStartMouse] = useState<Position | null>(null);
    const [initialNodePositions, setInitialNodePositions] = useState<Map<string, Position>>(new Map());

    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            if (e.button !== 0) return;

            const mousePos = getMousePosition(e, canvas);
            updateMousePosition(mousePos);

            const { items, selectedItemIds } = useCanvasStore.getState();
            const nodes = getNodes(items);
            const edges = getEdges(items);

            const clickedNode = findNodeUnderCursor(nodes, mousePos);
            const clickedEdge = !clickedNode ? findEdgeUnderCursor(edges, nodes, mousePos) : null;

            if (!clickedNode && !clickedEdge) return;

            const clickedItem = clickedNode || clickedEdge!;

            const newSelectedIds = selectCanvasItem({
                items,
                selectedIds: selectedItemIds,
                itemId: clickedItem.id,
                event: e,
            });

            setSelectedItemIds(newSelectedIds);

            handleOpenInspector(clickedItem);

            if (clickedNode) {
                setIsDraggingNodes(true);
                setDragStartMouse(mousePos);
                setInitialNodePositions(prepareDrag(nodes, newSelectedIds));
            }
        },
        [canvasRef, setSelectedItemIds, updateMousePosition],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const mousePos = getMousePosition(e, canvas);
            updateMousePosition(mousePos);

            if (isPanningRef?.current) return;

            const items = useCanvasStore.getState().items;
            const nodes = getNodes(items);

            if (!isDraggingNodes) {
                const hoveredNode = findNodeUnderCursor(nodes, mousePos);
                canvas.style.cursor = hoveredNode ? 'move' : 'default';
            }

            if (tempEdge) {
                setTempEdge({ ...tempEdge, toPos: mousePos });
                return;
            }

            if (!isDraggingNodes || !dragStartMouse) return;

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
        },
        [
            canvasRef,
            dragStartMouse,
            initialNodePositions,
            isDraggingNodes,
            nodeMoveStep,
            selectedItemIds,
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

            if (tempEdge) {
                const items = useCanvasStore.getState().items;
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

            if (isDraggingNodes) {
                setIsDraggingNodes(false);
                setDragStartMouse(null);
                setInitialNodePositions(new Map());
            }
        },
        [canvasRef, tempEdge, setTempEdge, setItems, isDraggingNodes],
    );

    return { onMouseDown, onMouseMove, onMouseUp };
}
