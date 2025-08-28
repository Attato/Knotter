import { Node } from '@/canvas/canvas.types';
import { selectRangeNodes } from '@/canvas/utils/selectRangeNodes';

export function updateNodeSelection(
    nodes: Node[],
    selectedIds: string[],
    nodeId: string,
    e: Pick<MouseEvent, 'ctrlKey' | 'metaKey' | 'shiftKey'>,
): string[] {
    if (e.shiftKey && selectedIds.length > 0) {
        const lastSelectedId = selectedIds[selectedIds.length - 1];
        return selectRangeNodes(nodes, lastSelectedId, nodeId);
    }

    if (e.ctrlKey || e.metaKey) {
        return selectedIds.includes(nodeId) ? selectedIds.filter((id) => id !== nodeId) : [...selectedIds, nodeId];
    }

    return [nodeId];
}
