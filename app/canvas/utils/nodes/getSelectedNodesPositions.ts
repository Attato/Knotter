import { CanvasItem, Position } from '@/canvas/canvas.types';

export function getSelectedNodesPositions(nodes: CanvasItem[], selectedIds: string[]): Map<string, Position> {
    const positions = new Map<string, Position>();

    for (const node of nodes) {
        if (selectedIds.includes(node.id)) {
            positions.set(node.id, { ...node.position });
        }
    }

    return positions;
}
