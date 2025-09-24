import { useRef, useEffect, RefObject } from 'react';
import { Position } from '@/canvas/canvas.types';

import { setupPan, setupZoom, setupScroll } from '@/canvas/events/canvasEvents';

export function useCanvasInteraction(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const isPanningRef = useRef(false);
    const lastMouseRef = useRef<Position | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const cleanupPan = setupPan(canvas, isPanningRef, lastMouseRef);
        const cleanupZoom = setupZoom(canvas);
        const cleanupScroll = setupScroll(canvas);

        return () => {
            cleanupPan();
            cleanupZoom();
            cleanupScroll();
        };
    }, [canvasRef]);
}
