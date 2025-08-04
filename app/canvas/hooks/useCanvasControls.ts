import { useState, useEffect, useLayoutEffect, RefObject } from 'react';

import { Point } from '@/canvas/canvas.types';
import { INITIAL_ZOOM } from '@/canvas/constants';

import { setupPan, setupSelect, setupZoom, setupScroll } from '@/canvas/events/canvasEvents';

export function useCanvasControls(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM);

    const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
    const [selectionStart, setSelectionStart] = useState<Point | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Point | null>(null);
    const [lastMousePosition, setLastMousePosition] = useState<Point | null>(null);

    const [isPanning, setIsPanning] = useState(false);
    const [isInitialOffsetSet, setInitialOffsetFlag] = useState(false);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas || isInitialOffsetSet) return;

        const rect = canvas.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0) {
            setOffset({ x: rect.width / 2, y: rect.height / 2 });
            setInitialOffsetFlag(true);
        }
    }, [canvasRef, isInitialOffsetSet]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas || !isInitialOffsetSet) return;

        const cleanupPan = setupPan(canvas, isPanning, setIsPanning, lastMousePosition, setLastMousePosition, setOffset);
        const cleanupSelect = setupSelect(canvas, offset, zoomLevel, setSelectionStart, setSelectionEnd);
        const cleanupZoom = setupZoom(canvas, zoomLevel, setZoomLevel, setOffset);
        const cleanupScroll = setupScroll(canvas, setOffset);

        return () => {
            cleanupPan();
            cleanupSelect();
            cleanupZoom();
            cleanupScroll();
        };
    }, [canvasRef, isPanning, lastMousePosition, offset, zoomLevel, isInitialOffsetSet]);

    return {
        offset,
        zoomLevel,
        selectionStart,
        selectionEnd,
    };
}
