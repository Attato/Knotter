import { Position } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';

export function getNodeAtPosition(nodes: { id: string; position: Position }[], pos: Position) {
    const halfSize = NODE_SIZE / 2;

    return nodes.find((node) => {
        const { x, y } = node.position;

        return pos.x >= x - halfSize && pos.x <= x + halfSize && pos.y >= y - halfSize && pos.y <= y + halfSize;
    });
}
