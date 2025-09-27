'use client';

import { CanvasItem } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { selectCanvasItem } from '@/canvas/utils/selectCanvasItem';
import { handleOpenInspector } from '@/canvas/utils/handleOpenInspector';

export function useCanvasSidebarList(filterText: string) {
    const canvasItems = useCanvasStore((state) => state.items);
    const { selectedItemIds, setSelectedItemIds, setItems } = useCanvasStore();

    const filteredItems = canvasItems.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()));

    const handleChange = (updated: CanvasItem) => {
        const updatedItems = canvasItems.map((i) => (i.id === updated.id ? updated : i));
        setItems(updatedItems);
    };

    const handleSelect = (e: React.MouseEvent, itemId: string) => {
        const newSelectedIds = selectCanvasItem({
            items: canvasItems,
            selectedIds: selectedItemIds,
            itemId,
            event: {
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey,
            },
        });

        setSelectedItemIds(newSelectedIds);
    };

    const handleKeyDown = (e: React.KeyboardEvent, item: CanvasItem) => {
        if (e.key !== 'Enter') return;
        const isSelected = selectedItemIds.includes(item.id);

        if (!isSelected) {
            setSelectedItemIds([...selectedItemIds, item.id]);
            return;
        }

        handleOpenInspector?.(item);
    };

    return { filteredItems, handleChange, handleSelect, handleKeyDown, selectedItemIds };
}
