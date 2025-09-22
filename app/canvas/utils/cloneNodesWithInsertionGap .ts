import { Node } from '@/canvas/canvas.types';
import { v4 as uuidv4 } from 'uuid';
import { MAX_CANVAS_ITEMS } from '@/canvas/constants';

export const cloneNodesWithInsertionGap = (nodes: Node[], insertionGap: number, existingCount: number): Node[] => {
    const availableSlots = Math.max(0, MAX_CANVAS_ITEMS - existingCount);

    if (availableSlots === 0) {
        console.warn(`Достигнут лимит элементов на канвасе.`);
        return [];
    }

    const nodesToClone = nodes.slice(0, availableSlots);

    return nodesToClone.map((node) => ({
        ...node,
        id: uuidv4(),
        position: { x: node.position.x + insertionGap, y: node.position.y + insertionGap },
    }));
};
