import { Position } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';

export function getNodeAtPosition(nodes: { id: number; position: Position }[], pos: Position) {
    return nodes.find((node) => {
        const { x, y } = node.position;
        return pos.x >= x && pos.x <= x + NODE_SIZE && pos.y >= y && pos.y <= y + NODE_SIZE;
    });
}
