import { Node } from '@/canvas/canvas.types';

export const selectRangeNodes = (nodes: Node[], lastSelectedId: number, currentId: number): number[] => {
    const ids = nodes.map((n) => n.id);
    const start = ids.indexOf(lastSelectedId);
    const end = ids.indexOf(currentId);

    if (start === -1 || end === -1) return [];

    const [from, to] = start < end ? [start, end] : [end, start];

    return ids.slice(from, to + 1);
};
