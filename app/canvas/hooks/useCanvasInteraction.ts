'use client';

import { useEffect, RefObject, useRef } from 'react';
import { useInitialCanvasOffset } from '@/canvas/hooks/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/hooks/useCanvasHotkeys';
import { useCanvasSelection } from '@/canvas/hooks/useCanvasSelection';
import { useCanvasMouseEvents } from '@/canvas/hooks/useCanvasMouseEvents';
import { getPanEventHandlers, getScrollEventHandler, getZoomEventHandler } from '@/canvas/utils/getCanvasEventHandlers';
import { getSelectionEventHandler } from '@/canvas/utils/getSelectionEventHandler';

export function useCanvasInteraction(canvasRef: RefObject<HTMLCanvasElement | null>) {
    useInitialCanvasOffset(canvasRef);
    useCanvasHotkeys(canvasRef);

    const { selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, handleSelectionArea } = useCanvasSelection();

    const isPanningRef = useRef(false);
    const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

    const { onMouseDown, onMouseMove, onMouseUp } = useCanvasMouseEvents(canvasRef, isPanningRef);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const panHandlers = getPanEventHandlers(isPanningRef, lastMouseRef, canvasRef);
        const selectHandlers = getSelectionEventHandler(setSelectionStart, setSelectionEnd, handleSelectionArea);
        const handleScroll = getScrollEventHandler();
        const handleZoom = getZoomEventHandler(canvas);

        const handleMouseDown = (e: MouseEvent) => {
            panHandlers.handleMouseDown(e);
            onMouseDown(e);
            selectHandlers.handleMouseDown(e);
        };

        const handleMouseMove = (e: MouseEvent) => {
            panHandlers.handleMouseMove(e);
            onMouseMove(e);
            selectHandlers.handleMouseMove(e);
        };

        const handleMouseUp = (e: MouseEvent) => {
            panHandlers.handleMouseUp();
            onMouseUp(e);
            selectHandlers.handleMouseUp(e);
        };

        const handleWheel = (e: WheelEvent) => {
            handleScroll(e);
            handleZoom(e);
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [canvasRef, onMouseDown, onMouseMove, onMouseUp, setSelectionStart, setSelectionEnd, handleSelectionArea]);

    return { selectionStart, selectionEnd };
}
