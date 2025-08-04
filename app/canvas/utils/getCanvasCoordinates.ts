import { Point } from '@/canvas/canvas.types';

export function getCanvasCoordinates(event: MouseEvent, canvas: HTMLCanvasElement, offset: Point, zoomLevel: number): Point {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left - offset.x) / zoomLevel,
        y: (event.clientY - rect.top - offset.y) / zoomLevel,
    };
}
