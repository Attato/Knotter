import { Node, Edge, CanvasItem } from '@/canvas/canvas.types';
import { handleAddItem } from '@/canvas/utils/handleAddItem';
import { MAX_CANVAS_ITEMS } from '@/canvas/constants';

export const cloneEdgesForNewNodes = (
    edges: Edge[],
    newNodes: Node[],
    nodeIdMap: Map<string, string>,
    existingCount: number,
): Edge[] => {
    const clonedEdges: Edge[] = [];
    let currentCount = existingCount;

    for (const edge of edges) {
        if (currentCount >= MAX_CANVAS_ITEMS) {
            console.warn(`Достигнут лимит элементов на канвасе.`);
            break;
        }

        const fromNode = newNodes.find((n) => n.id === nodeIdMap.get(edge.from));
        const toNode = newNodes.find((n) => n.id === nodeIdMap.get(edge.to));

        if (!fromNode || !toNode) continue;

        const newItem: CanvasItem | null = handleAddItem({
            type: 'edge',
            state: { nodes: newNodes, edges: clonedEdges },
            fromNode,
            toNode,
        });

        if (newItem && newItem.kind === 'edge') {
            clonedEdges.push(newItem);
            currentCount++;
        }
    }

    return clonedEdges;
};
