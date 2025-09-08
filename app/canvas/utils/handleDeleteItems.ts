import { CanvasItem } from '@/canvas/canvas.types';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';

export function handleDeleteItems(items: CanvasItem[], selectedIds: string[]): CanvasItem[] {
    const nodes = getNodes(items);
    const edges = getEdges(items);

    const toDeleteNodes = new Set(nodes.filter((n) => selectedIds.includes(n.id)).map((n) => n.id));
    const toDeleteEdges = new Set(edges.filter((e) => selectedIds.includes(e.id)).map((e) => e.id));

    return items.filter((item) => {
        if (item.kind === 'node') {
            return !toDeleteNodes.has(item.id);
        }

        if (item.kind === 'edge') {
            return !toDeleteEdges.has(item.id) && !toDeleteNodes.has(item.from) && !toDeleteNodes.has(item.to);
        }

        return true;
    });
}
