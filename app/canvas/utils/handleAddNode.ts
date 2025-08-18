import { Node } from '@/canvas/canvas.types';

export function handleAddNode(nodes: Node[]): Node[] {
    const step = 10;
    let x = 0;
    let y = 0;

    while (nodes.some((node) => node.position.x === x && node.position.y === y)) {
        x += step;
        y += step;
    }

    const newNode: Node = {
        id: nodes.length > 0 ? nodes[nodes.length - 1].id + 1 : 1,
        type: 'octagon',
        position: { x, y },
    };

    return [...nodes, newNode];
}
