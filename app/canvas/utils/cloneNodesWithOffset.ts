import { Node } from '../canvas.types';
import { v4 as uuidv4 } from 'uuid';

export const cloneNodesWithOffset = (nodes: Node[], offset: number): Node[] =>
    nodes.map((node) => ({
        ...node,
        id: uuidv4(),
        position: { x: node.position.x + offset, y: node.position.y + offset },
    }));
