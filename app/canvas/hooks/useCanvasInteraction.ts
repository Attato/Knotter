'use client';

import { useEffect, RefObject, useRef } from 'react';

import { Position } from '@/canvas/canvas.types';

import { useInitialCanvasOffset } from '@/canvas/hooks/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/hooks/useCanvasHotkeys';
import { useCanvasMouseEvents } from '@/canvas/hooks/useCanvasMouseEvents';

import { getPanEventHandler } from '@/canvas/utils/eventHandlers/getPanEventHandler';
import { getScrollEventHandler } from '@/canvas/utils/eventHandlers/getScrollEventHandler';
import { getSelectionEventHandler } from '@/canvas/utils/eventHandlers/getSelectionEventHandler';
import { getZoomEventHandler } from '@/canvas/utils/eventHandlers/getZoomEventHandler';

interface useCanvasInteractionProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    selectionStart: Position | null;
    setSelectionStart: (value: Position | null) => void;
    setSelectionEnd: (value: Position | null) => void;
    selectItemsInArea: (start: Position, end: Position) => void;
}

export function useCanvasInteraction({
    canvasRef,
    selectionStart,
    setSelectionStart,
    setSelectionEnd,
    selectItemsInArea,
}: useCanvasInteractionProps) {
    useInitialCanvasOffset(canvasRef);
    useCanvasHotkeys(canvasRef);

    const isPanningRef = useRef(false);
    const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

    const { onMouseDown, onMouseMove, onMouseUp } = useCanvasMouseEvents(canvasRef, isPanningRef);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const panHandlers = getPanEventHandler(isPanningRef, lastMouseRef, canvasRef);
        const selectHandlers = getSelectionEventHandler(
            selectionStart,
            setSelectionStart,
            setSelectionEnd,
            selectItemsInArea,
        );
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
    }, [
        canvasRef,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        selectionStart,
        setSelectionStart,
        setSelectionEnd,
        selectItemsInArea,
    ]);
}
