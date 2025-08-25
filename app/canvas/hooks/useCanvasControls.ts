import { useState, useEffect, useCallback, RefObject } from 'react';

import { Position, Edge } from '@/canvas/canvas.types';

import { INITIAL_ZOOM } from '@/canvas/constants';

import { setupPan, setupSelect, setupZoom, setupScroll } from '@/canvas/events/canvasEvents';

import { useInitialCanvasOffset } from '@/canvas/hooks/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/hooks/useCanvasHotkeys';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { getMousePosition } from '@/canvas/utils/getMousePosition';
import { getNodeAtPosition } from '@/canvas/utils/getNodeAtPosition';
import { getNodesInSelectionArea } from '@/canvas/utils/getNodesInSelectionArea';
import { updateNodeSelection } from '../utils/updateNodeSelection';

export function useCanvasControls(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const { nodes, setNodes, edges, setEdges, tempEdge, setTempEdge, selectedNodeIds, setSelectedNodeIds } =
        useCanvasStore();

    const { offset, setOffset, isInitialOffsetSet } = useInitialCanvasOffset(canvasRef);

    const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM);
    const [selectionStart, setSelectionStart] = useState<Position | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Position | null>(null);
    const [lastMousePosition, setLastMousePosition] = useState<Position | null>(null);
    const [isPanning, setIsPanning] = useState(false);

    const [isDraggingNodes, setIsDraggingNodes] = useState(false);
    const [dragStartMouse, setDragStartMouse] = useState<Position | null>(null);
    const [initialNodePositions, setInitialNodePositions] = useState<Map<number, Position>>(new Map());

    useCanvasHotkeys();

    const handleMouseDown = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;

            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const mousePos = getMousePosition(e, rect, offset, zoomLevel);

            const clickedNode = getNodeAtPosition(nodes, mousePos);

            if (!clickedNode) return;

            let newSelectedIds = selectedNodeIds;

            if (!selectedNodeIds.includes(clickedNode.id)) {
                newSelectedIds = updateNodeSelection(nodes, selectedNodeIds, clickedNode.id, e);
            }

            setSelectedNodeIds(newSelectedIds);

            setIsDraggingNodes(true);
            setDragStartMouse(mousePos);

            const positions = new Map<number, Position>();

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
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const mousePos = getMousePosition(e, rect, offset, zoomLevel);

            if (tempEdge) {
                setTempEdge({ ...tempEdge, toPos: mousePos });
                return;
            }

            if (!isDraggingNodes || !dragStartMouse) return;

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
            tempEdge,
            setTempEdge,
            canvasRef,
        ],
    );

    const handleMouseUp = useCallback(
        (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const mousePos = getMousePosition(e, rect, offset, zoomLevel);

            if (tempEdge) {
                const targetNode = getNodeAtPosition(nodes, mousePos);

                if (targetNode && targetNode.id !== tempEdge.from) {
                    const exists = edges.some((edge) => edge.from === tempEdge.from && edge.to === targetNode.id);

                    if (!exists) {
                        const newEdge: Edge = {
                            id: edges.length > 0 ? Math.max(...edges.map((edge) => edge.id)) + 1 : 1,
                            from: tempEdge.from,
                            to: targetNode.id,
                        };
                        setEdges([...edges, newEdge]);
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
        [isDraggingNodes, nodes, edges, setEdges, tempEdge, setTempEdge, canvasRef, offset, zoomLevel],
    );

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
