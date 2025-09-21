'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';
import { Position } from '@/canvas/canvas.types';

import { setupPan, setupSelect, setupZoom, setupScroll } from '@/canvas/events/canvasEvents';
import { useInitialCanvasOffset } from '@/canvas/hooks/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/hooks/useCanvasHotkeys';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { findNodeUnderCursor } from '@/canvas/utils/findNodeUnderCursor';
import { findEdgeUnderCursor } from '@/canvas/utils/findEdgeUnderCursor';
import { getMousePosition } from '@/canvas/utils/getMousePosition';
import { getItemsInSelectionArea } from '@/canvas/utils/getItemsInSelectionArea';
import { selectCanvasItem } from '@/canvas/utils/selectCanvasItem';
import { moveNodes } from '@/canvas/utils/moveNodes';
import { handleAddEdge } from '@/canvas/utils/handleAddEdge';
import { handleOpenInspector } from '@/canvas/utils/handleOpenInspector';
import { prepareDrag } from '@/canvas/utils/prepareDrag';

import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';

export function useCanvasControls(canvasRef: RefObject<HTMLCanvasElement | null>) {
    useInitialCanvasOffset(canvasRef);
    const isPanningRef = useRef(false);
    const lastMouseRef = useRef<Position | null>(null);

    const {
        setItems,
        nodeMoveStep,
        tempEdge,
        setTempEdge,
        offset,
        zoomLevel,
        selectedItemIds,
        setSelectedItemIds,
        updateMousePosition,
    } = useCanvasStore();

    const [isDraggingNodes, setIsDraggingNodes] = useState(false);
    const [selectionStart, setSelectionStart] = useState<Position | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Position | null>(null);
    const [dragStartMouse, setDragStartMouse] = useState<Position | null>(null);
    const [initialNodePositions, setInitialNodePositions] = useState<Map<string, Position>>(new Map());
    const [clickedNodeId, setClickedNodeId] = useState<string | null>(null);

    useCanvasHotkeys(canvasRef);

    const handleMouseDown = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const mousePos = getMousePosition(e, canvas);
            updateMousePosition(mousePos);

            const items = useCanvasStore.getState().items;
            const nodes = getNodes(items);
            const edges = getEdges(items);

            const clickedNode = findNodeUnderCursor(nodes, mousePos);
            const clickedEdge = !clickedNode ? findEdgeUnderCursor(edges, nodes, mousePos) : null;

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

            if (clickedNode && selectedItemIds.includes(clickedNode.id) && clickedNodeId !== clickedNode.id) {
                setClickedNodeId(clickedNode.id);
            }

            const isAlreadySelected = selectedItemIds.includes(clickedNode.id) && !isModifierPressed;

            if (!isAlreadySelected) return;

            if (clickedNodeId === clickedNode.id) {
                handleOpenInspector(clickedNode);
                setClickedNodeId(null);
                return;
            }

            setClickedNodeId(clickedNode.id);
        },
        [canvasRef, selectedItemIds, setSelectedItemIds, clickedNodeId, updateMousePosition],
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const mousePos = getMousePosition(e, canvas);
            updateMousePosition(mousePos);

            const { items } = useCanvasStore.getState();
            const nodes = getNodes(items);

            const hoveredNode = findNodeUnderCursor(nodes, mousePos);
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
            canvasRef,
            dragStartMouse,
            initialNodePositions,
            isDraggingNodes,
            nodeMoveStep,
            selectedItemIds,
            setItems,
            updateMousePosition,
            tempEdge,
            setTempEdge,
        ],
    );

    const handleMouseUp = useCallback(
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
        [canvasRef, tempEdge, setTempEdge, setItems, isDraggingNodes],
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
        (canvas: HTMLCanvasElement) => setupSelect(canvas, setSelectionStart, setSelectionEnd, handleSelectionArea),
        [handleSelectionArea],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        const cleanupPan = setupPan(canvas, isPanningRef, lastMouseRef);
        const cleanupSelect = initializeSelection(canvas);
        const cleanupZoom = setupZoom(canvas);
        const cleanupScroll = setupScroll(canvas);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            cleanupPan();
            cleanupSelect();
            cleanupZoom();
            cleanupScroll();
        };
    }, [canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, initializeSelection]);

    return {
        offset,
        zoomLevel,
        selectionStart,
        selectionEnd,
    };
}
