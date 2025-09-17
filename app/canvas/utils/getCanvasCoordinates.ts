import { Position } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export function getCanvasCoordinates(event: MouseEvent, canvas: HTMLCanvasElement): Position {
    const { offset, zoomLevel } = useCanvasStore.getState();
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left - offset.x) / zoomLevel,
        y: (event.clientY - rect.top - offset.y) / zoomLevel,
    };
}
