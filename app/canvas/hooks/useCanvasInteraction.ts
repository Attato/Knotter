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

import { MouseHandler } from '@/canvas/canvas.types';

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

    const panHandlers = useRef<ReturnType<typeof getPanEventHandler> | null>(null);
    const selectHandlers = useRef<ReturnType<typeof getSelectionEventHandler> | null>(null);
    const handleScroll = useRef(getScrollEventHandler());
    const handleZoom = useRef<((e: WheelEvent) => void) | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        panHandlers.current = getPanEventHandler(isPanningRef, lastMouseRef, canvasRef);
        selectHandlers.current = getSelectionEventHandler(
            selectionStart,
            setSelectionStart,
            setSelectionEnd,
            selectItemsInArea,
        );
        handleZoom.current = getZoomEventHandler(canvas);

        const handleMouseDown: MouseHandler = (e) => {
            panHandlers.current?.handleMouseDown(e);
            onMouseDown(e);
            selectHandlers.current?.handleMouseDown(e);
        };

        const handleMouseMove: MouseHandler = (e) => {
            panHandlers.current?.handleMouseMove(e);
            onMouseMove(e);
            selectHandlers.current?.handleMouseMove(e);
        };

        const handleMouseUp: MouseHandler = (e) => {
            panHandlers.current?.handleMouseUp();
            onMouseUp(e);
            selectHandlers.current?.handleMouseUp(e);
        };

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
                handleZoom.current?.(e);
                return;
            }

            const isTouchpadPan = panHandlers.current?.handleWheelForTouchpad(e);

            if (isTouchpadPan) {
                e.preventDefault();
            } else {
                handleScroll.current?.(e);
            }
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
        selectionStart,
        setSelectionStart,
        setSelectionEnd,
        selectItemsInArea,
        onMouseDown,
        onMouseMove,
        onMouseUp,
    ]);
}
