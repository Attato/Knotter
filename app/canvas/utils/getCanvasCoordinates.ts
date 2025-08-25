import { Position } from '@/canvas/canvas.types';

export function getCanvasCoordinates(
    event: MouseEvent,
    canvas: HTMLCanvasElement,
    offset: Position,
    zoomLevel: number,
): Position {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left - offset.x) / zoomLevel,
        y: (event.clientY - rect.top - offset.y) / zoomLevel,
    };
}
