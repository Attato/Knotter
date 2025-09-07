import { Edge, Node, Position } from '@/canvas/canvas.types';
import { v4 as uuidv4 } from 'uuid';

export function handleAddEdge(edges: Edge[], fromNode: Node, toNode: Node, position?: Position): Edge {
    const baseName = 'Связь';
    let name = baseName;
    let counter = 0;

    const existingNames = new Set(edges.map((e) => e.name));

    while (existingNames.has(name)) {
        counter++;
        name = `${baseName} (${counter})`;
    }

    return {
        id: uuidv4(),
        name,
        from: fromNode.id,
        to: toNode.id,
        position: position ?? {
            x: (fromNode.position.x + toNode.position.x) / 2,
            y: (fromNode.position.y + toNode.position.y) / 2,
        },
        kind: 'edge',
    };
}
