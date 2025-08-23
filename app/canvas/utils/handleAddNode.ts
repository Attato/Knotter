import { Node } from '@/canvas/canvas.types';
import { Point } from '@/canvas/canvas.types';

export function handleAddNode(nodes: Node[], position?: Point): Node[] {
    const step = 10;
    let x = position?.x ?? 0;
    let y = position?.y ?? 0;

    if (!position) {
        while (nodes.some((node) => node.position.x === x && node.position.y === y)) {
            x += step;
            y += step;
        }
    }

    const newNode: Node = {
        id: nodes.length > 0 ? nodes[nodes.length - 1].id + 1 : 1,
        type: 'octagon',
        position: { x, y },
    };

    return [...nodes, newNode];
}
