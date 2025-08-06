import { useState, useEffect, RefObject } from 'react';
import { Point, Node } from '@/canvas/canvas.types';
import { INITIAL_ZOOM } from '@/canvas/constants';
import { setupPan, setupSelect, setupZoom, setupScroll } from '@/canvas/events/canvasEvents';
import { getNodesInSelectionArea } from '@/canvas/utils/getNodesInSelectionArea';
import { useInitialCanvasOffset } from './useInitialCanvasOffset'; // путь зависит от структуры проекта

export function useCanvasControls(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    nodes: Node[],
    setSelectedNodeIds: (ids: number[]) => void,
) {
    const { offset, setOffset, isInitialOffsetSet } = useInitialCanvasOffset(canvasRef);

    const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM);
    const [selectionStart, setSelectionStart] = useState<Point | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Point | null>(null);
    const [lastMousePosition, setLastMousePosition] = useState<Point | null>(null);
    const [isPanning, setIsPanning] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isInitialOffsetSet) return;

        const cleanupPan = setupPan(canvas, isPanning, setIsPanning, lastMousePosition, setLastMousePosition, setOffset);

        const cleanupSelect = setupSelect(canvas, offset, zoomLevel, setSelectionStart, setSelectionEnd, (start, end) => {
            const selected = getNodesInSelectionArea(nodes, start, end);
            setSelectedNodeIds(selected);
        });

        const cleanupZoom = setupZoom(canvas, zoomLevel, setZoomLevel, setOffset);
        const cleanupScroll = setupScroll(canvas, setOffset);

        return () => {
            cleanupPan();
            cleanupSelect();
            cleanupZoom();
            cleanupScroll();
        };
    }, [
        canvasRef,
        isPanning,
        lastMousePosition,
        offset,
        zoomLevel,
        isInitialOffsetSet,
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
