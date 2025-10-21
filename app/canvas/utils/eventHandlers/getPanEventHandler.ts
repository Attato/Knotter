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

    return { handleMouseDown, handleMouseMove, handleMouseUp };
}
