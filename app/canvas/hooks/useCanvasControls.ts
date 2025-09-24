'use client';

import { useEffect, RefObject, useCallback } from 'react';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { useInitialCanvasOffset } from '@/canvas/hooks/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/hooks/useCanvasHotkeys';
import { useCanvasSelection } from '@/canvas/hooks/useCanvasSelection';
import { useCanvasMouseEvents } from '@/canvas/hooks/useCanvasMouseEvents';
import { useCanvasInteraction } from '@/canvas/hooks/useCanvasInteraction';
import { setupSelection } from '@/canvas/events/setupSelection';

export function useCanvasControls(canvasRef: RefObject<HTMLCanvasElement | null>) {
    useInitialCanvasOffset(canvasRef);
    useCanvasHotkeys(canvasRef);
    useCanvasInteraction(canvasRef);

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

        const cleanupSelect = initializeSelection(canvas);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            cleanupSelect();
        };
    }, [canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, initializeSelection]);

    return { offset, zoomLevel, selectionStart, selectionEnd };
}
