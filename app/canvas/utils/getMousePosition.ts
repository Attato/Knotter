import { Point } from '@/canvas/canvas.types';

export function getMousePosition(e: MouseEvent, rect: DOMRect, offset: Point, zoom: number): Point {
    return {
        x: (e.clientX - rect.left - offset.x) / zoom,
        y: (e.clientY - rect.top - offset.y) / zoom,
    };
}
