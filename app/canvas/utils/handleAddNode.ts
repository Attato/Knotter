import { Node, Position } from '@/canvas/canvas.types';
import { v4 as uuidv4 } from 'uuid';

export function handleAddNode(nodes: Node[], position?: Position): Node {
    const step = 10;
    let x = position?.x ?? 0;
    let y = position?.y ?? 0;

    if (!position) {
        while (nodes.some((node) => node.position.x === x && node.position.y === y)) {
            x += step;
            y += step;
        }
    }

    const baseName = 'Узел';
    let name = baseName;
    let counter = 0;

    const existingNames = new Set(nodes.map((n) => n.name));

    while (existingNames.has(name)) {
        counter++;
        name = `${baseName} (${counter})`;
    }

    return {
        id: uuidv4(),
        name,
        type: 'octagon',
        position: { x, y },
        kind: 'node',
    };
}
