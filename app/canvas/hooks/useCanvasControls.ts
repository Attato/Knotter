import { useState, useEffect, useCallback, RefObject } from 'react';

import { Point } from '@/canvas/canvas.types';

import { INITIAL_ZOOM } from '@/canvas/constants';

import { setupPan, setupSelect, setupZoom, setupScroll } from '@/canvas/events/canvasEvents';

import { getNodesInSelectionArea } from '@/canvas/utils/getNodesInSelectionArea';

import { useInitialCanvasOffset } from '@/canvas/hooks/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/hooks/useCanvasHotkeys';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { getMousePosition } from '@/canvas/utils/getMousePosition';
import { getNodeAtPosition } from '@/canvas/utils/getNodeAtPosition';
import { updateNodeSelection } from '@/canvas/utils/updateNodeSelection';

export function useCanvasControls(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const { nodes, setNodes, selectedNodeIds, setSelectedNodeIds } = useCanvasStore();

    const { offset, setOffset, isInitialOffsetSet } = useInitialCanvasOffset(canvasRef);

    const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM);
    const [selectionStart, setSelectionStart] = useState<Point | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Point | null>(null);
    const [lastMousePosition, setLastMousePosition] = useState<Point | null>(null);
    const [isPanning, setIsPanning] = useState(false);

    const [isDraggingNodes, setIsDraggingNodes] = useState(false);
    const [dragStartMouse, setDragStartMouse] = useState<Point | null>(null);
    const [initialNodePositions, setInitialNodePositions] = useState<Map<number, Point>>(new Map());

    useCanvasHotkeys();

    const handleMouseDown = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;

            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const mousePos = getMousePosition(e, rect, offset, zoomLevel);

            const clickedNode = getNodeAtPosition(nodes, mousePos);

            if (!clickedNode) return;

            const newSelectedIds = updateNodeSelection(nodes, selectedNodeIds, clickedNode.id, e);
            setSelectedNodeIds(newSelectedIds);

            setIsDraggingNodes(true);
            setDragStartMouse(mousePos);

            const positions = new Map<number, Point>();

            for (const node of nodes) {
                if (newSelectedIds.includes(node.id)) {
                    positions.set(node.id, { ...node.position });
                }
            }
            setInitialNodePositions(positions);
        },
        [canvasRef, offset, zoomLevel, nodes, selectedNodeIds, setSelectedNodeIds],
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDraggingNodes || !dragStartMouse) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const mousePos = getMousePosition(e, rect, offset, zoomLevel);

            const dx = mousePos.x - dragStartMouse.x;
            const dy = mousePos.y - dragStartMouse.y;

            setNodes(
                nodes.map((node) => {
                    if (selectedNodeIds.includes(node.id)) {
                        const initialPos = initialNodePositions.get(node.id);
                        if (!initialPos) return node;
                        return {
                            ...node,
                            position: {
                                x: initialPos.x + dx,
                                y: initialPos.y + dy,
                            },
                        };
                    }
                    return node;
                }),
            );
        },
        [
            isDraggingNodes,
            dragStartMouse,
            offset,
            zoomLevel,
            selectedNodeIds,
            initialNodePositions,
            nodes,
            setNodes,
            canvasRef,
        ],
    );

    const handleMouseUp = useCallback(() => {
        if (isDraggingNodes) {
            setIsDraggingNodes(false);
            setDragStartMouse(null);
            setInitialNodePositions(new Map());
        }
    }, [isDraggingNodes]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isInitialOffsetSet) return;

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        const cleanupPan = setupPan(canvas, isPanning, setIsPanning, lastMousePosition, setLastMousePosition, setOffset);

        const cleanupSelect = setupSelect(canvas, offset, zoomLevel, setSelectionStart, setSelectionEnd, (start, end) => {
            const selected = getNodesInSelectionArea(nodes, start, end);
            setSelectedNodeIds(selected);
        });

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
        nodes,
        setSelectedNodeIds,
        setOffset,
    ]);

    return {
        offset,
        zoomLevel,
        selectionStart,
        selectionEnd,
    };
}
