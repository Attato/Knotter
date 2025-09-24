import { Position } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export function setupSelection(
    canvas: HTMLCanvasElement,
    setSelectionStart: (val: Position | null) => void,
    setSelectionEnd: (val: Position | null) => void,
    onSelectionComplete?: (start: Position, end: Position) => void,
) {
    let start: Position | null = null;

    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;
        const mousePos = useCanvasStore.getState().mousePosition;
        start = mousePos;
        setSelectionStart(mousePos);
        setSelectionEnd(mousePos);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!start || (e.buttons & 1) !== 1) return;
        const mousePos = useCanvasStore.getState().mousePosition;
        setSelectionEnd(mousePos);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button !== 0 || !start) return;
        const mousePos = useCanvasStore.getState().mousePosition;
        onSelectionComplete?.(start, mousePos);
        setSelectionStart(null);
        setSelectionEnd(null);
        start = null;
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
