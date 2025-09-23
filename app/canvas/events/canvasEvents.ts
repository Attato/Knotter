import { RefObject } from 'react';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { Position } from '@/canvas/canvas.types';
import { MIN_ZOOM, MAX_ZOOM } from '@/canvas/constants';

export function setupPan(
    canvas: HTMLCanvasElement,
    isPanningRef: RefObject<boolean>,
    lastMouseRef: RefObject<Position | null>,
) {
    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 1) return;
        e.preventDefault();
        isPanningRef.current = true;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPanningRef.current || !lastMouseRef.current) return;

        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;

        const { offset, setOffset, invertY } = useCanvasStore.getState();

        setOffset({
            x: offset.x + dx,
            y: offset.y + (invertY ? -dy : dy),
        });

        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        isPanningRef.current = false;
        lastMouseRef.current = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
}

export function setupScroll(canvas: HTMLCanvasElement) {
    const handleScroll = (e: WheelEvent) => {
        if (e.ctrlKey) return;
        e.preventDefault();

        const dx = e.shiftKey ? e.deltaY : 0;
        const dy = !e.shiftKey ? e.deltaY : 0;

        const { offset, setOffset, invertY } = useCanvasStore.getState();

        setOffset({
            x: offset.x - dx,
            y: offset.y - (invertY ? -dy : dy),
        });
    };

    canvas.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
        canvas.removeEventListener('wheel', handleScroll);
    };
}

export function setupZoom(canvas: HTMLCanvasElement) {
    const handleZoom = (e: WheelEvent) => {
        if (!e.ctrlKey) return;
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const { offset, setOffset, zoomLevel, setZoomLevel, invertY } = useCanvasStore.getState();

        const zoomFactor = 1.1;
        const scale = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel * scale));

        const cursorY = invertY ? canvas.height - mouseY : mouseY;

        const newOffsetX = mouseX - (mouseX - offset.x) * (newZoom / zoomLevel);
        const newOffsetY = cursorY - (cursorY - offset.y) * (newZoom / zoomLevel);

        setOffset({ x: newOffsetX, y: newOffsetY });
        setZoomLevel(newZoom);
    };

    canvas.addEventListener('wheel', handleZoom, { passive: false });

    return () => {
        canvas.removeEventListener('wheel', handleZoom);
    };
}

export function setupSelect(
    canvas: HTMLCanvasElement,
    setSelectionStart: (val: Position | null) => void,
    setSelectionEnd: (val: Position | null) => void,
    onSelectionComplete?: (start: Position, end: Position) => void,
) {
    let selectionStart: Position | null = null;

    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const mousePos = useCanvasStore.getState().mousePosition;

        selectionStart = mousePos;
        setSelectionStart(mousePos);
        setSelectionEnd(mousePos);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!selectionStart || (e.buttons & 1) !== 1) return;

        const mousePos = useCanvasStore.getState().mousePosition;
        setSelectionEnd(mousePos);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button !== 0 || !selectionStart) return;

        const mousePos = useCanvasStore.getState().mousePosition;

        onSelectionComplete?.(selectionStart, mousePos);
        setSelectionStart(null);
        setSelectionEnd(null);
        selectionStart = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
    };
}
