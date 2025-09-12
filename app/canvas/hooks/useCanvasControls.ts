'use client';

import { useState, useEffect, useCallback, RefObject } from 'react';
import { Position } from '@/canvas/canvas.types';
import { INITIAL_ZOOM } from '@/canvas/constants';

import { setupPan, setupSelect, setupZoom, setupScroll } from '@/canvas/events/canvasEvents';
import { useInitialCanvasOffset } from '@/canvas/hooks/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/hooks/useCanvasHotkeys';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { getMousePosition } from '@/canvas/utils/getMousePosition';
import { getNodeAtPosition } from '@/canvas/utils/getNodeAtPosition';
import { getEdgeAtPosition } from '@/canvas/utils/getEdgeAtPosition';
import { getItemsInSelectionArea } from '@/canvas/utils/getItemsInSelectionArea';
import { selectCanvasItem } from '@/canvas/utils/selectCanvasItem';
import { moveNodes } from '@/canvas/utils/moveNodes';
import { handleAddEdge } from '@/canvas/utils/handleAddEdge';
import { openInspector } from '@/canvas/utils/openInspector';
import { prepareDrag } from '@/canvas/utils/prepareDrag';

import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';

export function useCanvasControls(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const { setItems, nodeMoveStep, tempEdge, setTempEdge, selectedItemIds, setSelectedItemIds } = useCanvasStore();
    const { offset, setOffset, isInitialOffsetSet } = useInitialCanvasOffset(canvasRef);

    const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM);
    const [selectionStart, setSelectionStart] = useState<Position | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Position | null>(null);
    const [lastMousePosition, setLastMousePosition] = useState<Position | null>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [isDraggingNodes, setIsDraggingNodes] = useState(false);
    const [dragStartMouse, setDragStartMouse] = useState<Position | null>(null);
    const [initialNodePositions, setInitialNodePositions] = useState<Map<string, Position>>(new Map());
    const [clickedNodeId, setClickedNodeId] = useState<string | null>(null);

    useCanvasHotkeys();

    const handleMouseDown = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const mousePos = getMousePosition(e, rect, offset, zoomLevel);

            const items = useCanvasStore.getState().items;
            const nodes = getNodes(items);
            const edges = getEdges(items);

            const clickedNode = getNodeAtPosition(nodes, mousePos);
            const clickedEdge = !clickedNode ? getEdgeAtPosition(edges, nodes, mousePos) : null;

            if (!clickedNode && !clickedEdge) return;

            const itemId = clickedNode?.id || clickedEdge!.id;
            const allItems = [...nodes, ...edges];

            let newSelectedIds = selectedItemIds;
            const isModifierPressed = e.ctrlKey || e.metaKey || e.shiftKey;

            if (!selectedItemIds.includes(itemId) || isModifierPressed) {
                newSelectedIds = selectCanvasItem(allItems, selectedItemIds, itemId, e);
                setSelectedItemIds(newSelectedIds);
                setClickedNodeId(null);
            }

            if (!clickedNode) return;

            setIsDraggingNodes(true);
            setDragStartMouse(mousePos);

            const positions = prepareDrag(nodes, newSelectedIds);
            setInitialNodePositions(positions);

            const isAlreadySelected = selectedItemIds.includes(clickedNode.id) && !isModifierPressed;

            if (!isAlreadySelected) return;

            if (clickedNodeId === clickedNode.id) {
                openInspector(clickedNode);
                setClickedNodeId(null);
            } else {
                setClickedNodeId(clickedNode.id);
            }
        },
        [canvasRef, offset, zoomLevel, selectedItemIds, setSelectedItemIds, clickedNodeId],
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const mousePos = getMousePosition(e, rect, offset, zoomLevel);

            const items = useCanvasStore.getState().items;
            const nodes = getNodes(items);

            const hoveredNode = getNodeAtPosition(nodes, mousePos);
            canvas.style.cursor = hoveredNode ? 'move' : 'default';

            if (tempEdge) {
                setTempEdge({ ...tempEdge, toPos: mousePos });
                return;
            }

            if (!isDraggingNodes || !dragStartMouse) return;

            const dx = mousePos.x - dragStartMouse.x;
            const dy = mousePos.y - dragStartMouse.y;

            const updatedNodes = moveNodes(nodes, selectedItemIds, initialNodePositions, { x: dx, y: dy }, nodeMoveStep);

            const currentItems = useCanvasStore.getState().items;
            const newItems = currentItems.map((item) => {
                if (item.kind === 'node' && selectedItemIds.includes(item.id)) {
                    const updatedNode = updatedNodes.find((n) => n.id === item.id);
                    return updatedNode ?? item;
                }
                return item;
            });
            setItems(newItems);
        },
        [
            isDraggingNodes,
            dragStartMouse,
            offset,
            zoomLevel,
            initialNodePositions,
            nodeMoveStep,
            tempEdge,
            setTempEdge,
            setItems,
            selectedItemIds,
            canvasRef,
        ],
    );

    const handleMouseUp = useCallback(
        (e: MouseEvent) => {
            if (tempEdge) {
                const items = useCanvasStore.getState().items;
                const nodes = getNodes(items);
                const edges = getEdges(items);

                const rect = canvasRef.current!.getBoundingClientRect();
                const mousePos = getMousePosition(e, rect, offset, zoomLevel);

                const targetNode = getNodeAtPosition(nodes, mousePos);
                const edgeExists = targetNode
                    ? edges.some((edge) => edge.from === tempEdge.from && edge.to === targetNode.id)
                    : true;

                if (targetNode && targetNode.id !== tempEdge.from && !edgeExists) {
                    const fromNode = nodes.find((n) => n.id === tempEdge.from);

                    if (fromNode) {
                        const newEdge = handleAddEdge(getEdges(items), fromNode, targetNode);
                        setItems([...items, newEdge]);
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
        [tempEdge, setTempEdge, setItems, isDraggingNodes, offset, zoomLevel, canvasRef],
    );

    const handleSelectionArea = useCallback(
        (start: Position, end: Position) => {
            const items = useCanvasStore.getState().items;
            const nodes = getNodes(items);
            const selected = getItemsInSelectionArea(nodes, start, end);
            setSelectedItemIds(selected);
        },
        [setSelectedItemIds],
    );

    const initializeSelection = useCallback(
        (canvas: HTMLCanvasElement) =>
            setupSelect(canvas, offset, zoomLevel, setSelectionStart, setSelectionEnd, handleSelectionArea),
        [offset, zoomLevel, handleSelectionArea],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isInitialOffsetSet) return;

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        const cleanupPan = setupPan(canvas, isPanning, setIsPanning, lastMousePosition, setLastMousePosition, setOffset);
        const cleanupSelect = initializeSelection(canvas);
        const cleanupZoom = setupZoom(canvas, zoomLevel, setZoomLevel, setOffset);
        const cleanupScroll = setupScroll(canvas, setOffset);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            cleanupPan();
            cleanupSelect();
            cleanupZoom();
            cleanupScroll();
        };
    }, [
        canvasRef,
        isInitialOffsetSet,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        isPanning,
        lastMousePosition,
        offset,
        zoomLevel,
        setOffset,
        initializeSelection,
    ]);

    return {
        offset,
        zoomLevel,
        selectionStart,
        selectionEnd,
    };
}
