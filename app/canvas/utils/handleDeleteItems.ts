import { CanvasItem } from '@/canvas/canvas.types';

export function handleDeleteItems(items: CanvasItem[], selectedIds: string[], kind?: 'node' | 'edge'): CanvasItem[] {
    return items.filter((item) => {
        if (kind) {
            if (item.kind !== kind) return true;
        }

        return !selectedIds.includes(item.id);
    });
}
