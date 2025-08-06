import { Node, Point } from '@/canvas/canvas.types';

export function getNodesInSelectionArea(nodes: Node[], selectionStart: Point, selectionEnd: Point): number[] {
    const x1 = Math.min(selectionStart.x, selectionEnd.x);
    const y1 = Math.min(selectionStart.y, selectionEnd.y);
    const x2 = Math.max(selectionStart.x, selectionEnd.x);
    const y2 = Math.max(selectionStart.y, selectionEnd.y);

    return nodes
        .filter((node) => {
            const size = 10;
            const { x, y } = node.position;
            return x + size >= x1 && x <= x2 && y + size >= y1 && y <= y2;
        })
        .map((node) => node.id);
}
