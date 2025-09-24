'use client';

import { useRef, useEffect, RefObject, useCallback } from 'react';
import { Position } from '@/canvas/canvas.types';

import { setupPan, setupZoom, setupScroll } from '@/canvas/events/canvasEvents';
import { setupSelection } from '@/canvas/events/setupSelection';

import { useInitialCanvasOffset } from '@/canvas/hooks/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/hooks/useCanvasHotkeys';
import { useCanvasSelection } from '@/canvas/hooks/useCanvasSelection';

import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { useCanvasMouseEvents } from '@/canvas/hooks/useCanvasMouseEvents';

export function useCanvasControls(canvasRef: RefObject<HTMLCanvasElement | null>) {
    useInitialCanvasOffset(canvasRef);
    useCanvasHotkeys(canvasRef);

    const isPanningRef = useRef(false);
    const lastMouseRef = useRef<Position | null>(null);

    const { offset, zoomLevel } = useCanvasStore();
    const { selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, handleSelectionArea } = useCanvasSelection();

    const initializeSelection = useCallback(
        (canvas: HTMLCanvasElement) => setupSelection(canvas, setSelectionStart, setSelectionEnd, handleSelectionArea),
        [setSelectionStart, setSelectionEnd, handleSelectionArea],
    );

    const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasMouseEvents(canvasRef);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        const cleanupPan = setupPan(canvas, isPanningRef, lastMouseRef);
        const cleanupZoom = setupZoom(canvas);
        const cleanupScroll = setupScroll(canvas);
        const cleanupSelect = initializeSelection(canvas);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            cleanupPan();
            cleanupZoom();
            cleanupScroll();
            cleanupSelect();
        };
    }, [canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, initializeSelection]);

    return { offset, zoomLevel, selectionStart, selectionEnd };
}
