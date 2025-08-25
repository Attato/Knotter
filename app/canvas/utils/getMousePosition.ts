import { Position } from '@/canvas/canvas.types';

export function getMousePosition(e: MouseEvent, rect: DOMRect, offset: Position, zoom: number): Position {
    return {
        x: (e.clientX - rect.left - offset.x) / zoom,
        y: (e.clientY - rect.top - offset.y) / zoom,
    };
}
