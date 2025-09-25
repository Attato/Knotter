'use client';

import { useEffect, RefObject } from 'react';
import { useInitialCanvasOffset } from '@/canvas/hooks/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/hooks/useCanvasHotkeys';
import { useCanvasSelection } from '@/canvas/hooks/useCanvasSelection';
import { useCanvasMouseEvents } from '@/canvas/hooks/useCanvasMouseEvents';
import { getPanEventHandlers, getScrollEventHandler, getZoomEventHandler } from '@/canvas/utils/getCanvasEventHandlers';
import { getSelectionEventHandler } from '@/canvas/utils/getSelectionEventHandler';

export function useCanvasControls(canvasRef: RefObject<HTMLCanvasElement | null>) {
    useInitialCanvasOffset(canvasRef);
    useCanvasHotkeys(canvasRef);

    const { selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, handleSelectionArea } = useCanvasSelection();

    const { onMouseDown, onMouseMove, onMouseUp } = useCanvasMouseEvents(canvasRef);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const isPanningRef = { current: false };
        const lastMouseRef = { current: null as { x: number; y: number } | null };

        const panHandlers = getPanEventHandlers(isPanningRef, lastMouseRef);
        const selectHandlers = getSelectionEventHandler(setSelectionStart, setSelectionEnd, handleSelectionArea);
        const handleScroll = getScrollEventHandler();
        const handleZoom = getZoomEventHandler(canvas);

        const handleMouseDown = (e: MouseEvent) => {
            onMouseDown(e);
            panHandlers.handleMouseDown(e);
            selectHandlers.handleMouseDown(e);
        };

        const handleMouseMove = (e: MouseEvent) => {
            onMouseMove(e);
            panHandlers.handleMouseMove(e);
            selectHandlers.handleMouseMove(e);
        };

        const handleMouseUp = (e: MouseEvent) => {
            onMouseUp(e);
            panHandlers.handleMouseUp();
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
