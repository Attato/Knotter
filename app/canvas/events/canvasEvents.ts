import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { Position } from '@/canvas/canvas.types';
import { MIN_ZOOM, MAX_ZOOM } from '@/canvas/constants';
import { getMousePosition } from '@/canvas/utils/getMousePosition';

export function setupPan(
    canvas: HTMLCanvasElement,
    isPanning: boolean,
    setIsPanning: (val: boolean) => void,
    lastMousePosition: Position | null,
    setLastMousePosition: (val: Position | null) => void,
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

        const { offset, setOffset, invertY } = useCanvasStore.getState();

        setOffset({
            x: offset.x + dx,
            y: offset.y + (invertY ? -dy : dy),
        });

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

        const { offset, setOffset, zoomLevel, setZoomLevel } = useCanvasStore.getState();

        const zoomFactor = 1.1;
        const deltaZoom = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel * deltaZoom));

        setOffset({
            x: mouseX - (mouseX - offset.x) * (newZoom / zoomLevel),
            y: mouseY - (mouseY - offset.y) * (newZoom / zoomLevel),
        });

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

        const position = getMousePosition(e, canvas);

        selectionStart = position;
        setSelectionStart(position);
        setSelectionEnd(position);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!selectionStart || (e.buttons & 1) !== 1) return;

        const position = getMousePosition(e, canvas);

        setSelectionEnd(position);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button !== 0 || !selectionStart) return;

        const position = getMousePosition(e, canvas);

        onSelectionComplete?.(selectionStart, position);
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
