import { Dispatch, SetStateAction } from 'react';

import { Point } from '@/canvas/canvas.types';
import { MIN_ZOOM, MAX_ZOOM } from '@/canvas/constants';

import { getCanvasCoordinates } from '@/canvas/utils/getCanvasCoordinates';

export function setupPan(
    canvas: HTMLCanvasElement,
    isPanning: boolean,
    setIsPanning: (val: boolean) => void,
    lastMousePosition: Point | null,
    setLastMousePosition: (val: Point | null) => void,
    setOffset: Dispatch<SetStateAction<Point>>,
) {
    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 1) return;
        e.preventDefault();
        setIsPanning(true);
        setLastMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPanning || !lastMousePosition) return;
        const dx = e.clientX - lastMousePosition.x;
        const dy = e.clientY - lastMousePosition.y;

        setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastMousePosition({ x: e.clientX, y: e.clientY });
    };

    const stopPanning = () => {
        setIsPanning(false);
        setLastMousePosition(null);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button === 1) stopPanning();
    };

    const handleMouseLeave = stopPanning;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
}

export function setupScroll(canvas: HTMLCanvasElement, setOffset: Dispatch<SetStateAction<Point>>) {
    const handleScroll = (e: WheelEvent) => {
        if (e.ctrlKey) return;

        e.preventDefault();

        const dx = e.shiftKey ? e.deltaY : 0;
        const dy = !e.shiftKey ? e.deltaY : 0;

        setOffset((prev) => ({
            x: prev.x - dx,
            y: prev.y - dy,
        }));
    };

    canvas.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
        canvas.removeEventListener('wheel', handleScroll);
    };
}

export function setupZoom(
    canvas: HTMLCanvasElement,
    zoomLevel: number,
    setZoomLevel: (val: number) => void,
    setOffset: Dispatch<SetStateAction<Point>>,
) {
    const handleZoom = (e: WheelEvent) => {
        if (!e.ctrlKey) return;

        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = 1.1;
        const deltaZoom = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel * deltaZoom));

        setOffset((prev) => ({
            x: mouseX - (mouseX - prev.x) * (newZoom / zoomLevel),
            y: mouseY - (mouseY - prev.y) * (newZoom / zoomLevel),
        }));

        setZoomLevel(newZoom);
    };

    canvas.addEventListener('wheel', handleZoom, { passive: false });

    return () => {
        canvas.removeEventListener('wheel', handleZoom);
    };
}

export function setupSelect(
    canvas: HTMLCanvasElement,
    offset: Point,
    zoomLevel: number,
    setSelectionStart: (val: Point | null) => void,
    setSelectionEnd: (val: Point | null) => void,
) {
    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const position = getCanvasCoordinates(e, canvas, offset, zoomLevel);

        setSelectionStart(position);
        setSelectionEnd(position);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if ((e.buttons & 1) !== 1) return;

        const position = getCanvasCoordinates(e, canvas, offset, zoomLevel);

        setSelectionEnd(position);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button === 0) {
            setSelectionStart(null);
            setSelectionEnd(null);
        }
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
