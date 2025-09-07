import { Position, Node } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';

export function getNodeAtPosition(nodes: Node[], pos: Position): Node | undefined {
    const halfSize = NODE_SIZE / 2;

    return nodes.find((node) => {
        const { x, y } = node.position;

        return pos.x >= x - halfSize && pos.x <= x + halfSize && pos.y >= y - halfSize && pos.y <= y + halfSize;
    });
}
