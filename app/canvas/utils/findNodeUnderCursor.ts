import { Position, Node } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';

export function findNodeUnderCursor(nodes: Node[], cursor: Position): Node | undefined {
    const halfSize = NODE_SIZE / 2;

    return nodes.find((node) => {
        const { x, y } = node.position;

        return cursor.x >= x - halfSize && cursor.x <= x + halfSize && cursor.y >= y - halfSize && cursor.y <= y + halfSize;
    });
}
