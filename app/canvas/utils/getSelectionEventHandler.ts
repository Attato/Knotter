import { Position } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export function getSelectionEventHandler(
    setSelectionStart: (value: Position | null) => void,
    setSelectionEnd: (value: Position | null) => void,
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
        if (!start || e.button !== 0) return;

        const mousePos = useCanvasStore.getState().mousePosition;

        onSelectionComplete?.(start, mousePos);
        setSelectionStart(null);
        setSelectionEnd(null);
        start = null;
    };

    return { handleMouseDown, handleMouseMove, handleMouseUp };
}
