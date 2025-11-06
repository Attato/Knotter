import { RefObject } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { Position } from '@/canvas/canvas.types';

export function getPanEventHandler(
    isPanningRef: RefObject<boolean>,
    lastMouseRef: RefObject<Position | null>,
    canvasRef?: RefObject<HTMLCanvasElement | null>,
) {
    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 1) return;
        e.preventDefault();

        isPanningRef.current = true;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };

        if (canvasRef?.current) canvasRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPanningRef.current || !lastMouseRef.current) return;

        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;

        useCanvasStore.setState(
            (state) => ({
                offset: {
                    x: state.offset.x + dx,
                    y: state.offset.y + (state.invertY ? -dy : dy),
                },
            }),
            false,
        );

        lastMouseRef.current = { x: e.clientX, y: e.clientY };

        if (canvasRef?.current) canvasRef.current.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
        isPanningRef.current = false;
        lastMouseRef.current = null;

        if (canvasRef?.current) canvasRef.current.style.cursor = 'default';
    };

    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 2) return;

        e.preventDefault();
        isPanningRef.current = true;

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        lastMouseRef.current = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2,
        };

        if (canvasRef?.current) canvasRef.current.style.cursor = 'grabbing';
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isPanningRef.current || !lastMouseRef.current || e.touches.length !== 2) return;

        e.preventDefault();

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const currentMidpoint = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2,
        };

        const dx = currentMidpoint.x - lastMouseRef.current.x;
        const dy = currentMidpoint.y - lastMouseRef.current.y;

        useCanvasStore.setState(
            (state) => ({
                offset: {
                    x: state.offset.x + dx,
                    y: state.offset.y + (state.invertY ? -dy : dy),
                },
            }),
            false,
        );

        lastMouseRef.current = currentMidpoint;
    };

    const handleTouchEnd = () => {
        isPanningRef.current = false;
        lastMouseRef.current = null;

        if (canvasRef?.current) canvasRef.current.style.cursor = 'default';
    };

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
}
