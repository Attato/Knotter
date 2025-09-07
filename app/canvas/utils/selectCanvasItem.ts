import { CanvasItem } from '@/canvas/canvas.types';

export function selectCanvasItem<T extends CanvasItem>(
    items: T[],
    selectedIds: string[],
    itemId: string,
    e: Pick<MouseEvent, 'ctrlKey' | 'metaKey' | 'shiftKey'>,
): string[] {
    if (e.shiftKey && selectedIds.length > 0) {
        const ids = items.map((i) => i.id);
        const lastSelectedId = selectedIds[selectedIds.length - 1];
        const start = ids.indexOf(lastSelectedId);
        const end = ids.indexOf(itemId);

        if (start === -1 || end === -1) return [];

        const [from, to] = start < end ? [start, end] : [end, start];
        return ids.slice(from, to + 1);
    }

    if (e.ctrlKey || e.metaKey) {
        return selectedIds.includes(itemId) ? selectedIds.filter((id) => id !== itemId) : [...selectedIds, itemId];
    }

    return [itemId];
}
