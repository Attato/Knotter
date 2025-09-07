import { CanvasItem, Position } from '@/canvas/canvas.types';

export function getItemsInSelectionArea(items: CanvasItem[], selectionStart: Position, selectionEnd: Position): string[] {
    const x1 = Math.min(selectionStart.x, selectionEnd.x);
    const y1 = Math.min(selectionStart.y, selectionEnd.y);
    const x2 = Math.max(selectionStart.x, selectionEnd.x);
    const y2 = Math.max(selectionStart.y, selectionEnd.y);

    return items
        .filter((item) => {
            const { x, y } = item.position;
            return x >= x1 && x <= x2 && y >= y1 && y <= y2;
        })
        .map((item) => item.id);
}
