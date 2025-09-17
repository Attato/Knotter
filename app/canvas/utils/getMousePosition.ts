import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { Position } from '@/canvas/canvas.types';

export function getMousePosition(e: MouseEvent, rect: DOMRect): Position {
    const { offset, zoomLevel } = useCanvasStore.getState();

    return {
        x: (e.clientX - rect.left - offset.x) / zoomLevel,
        y: (e.clientY - rect.top - offset.y) / zoomLevel,
    };
}
