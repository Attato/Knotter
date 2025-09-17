import { Node } from '@/canvas/canvas.types';
import { v4 as uuidv4 } from 'uuid';

export const cloneNodesWithInsertionGap = (nodes: Node[], insertionGap: number): Node[] =>
    nodes.map((node) => ({
        ...node,
        id: uuidv4(),
        position: { x: node.position.x + insertionGap, y: node.position.y + insertionGap },
    }));
