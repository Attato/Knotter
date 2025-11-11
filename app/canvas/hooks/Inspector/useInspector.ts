'use client';

import { useCallback } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { CanvasItem } from '@/canvas/canvas.types';

export function useInspector() {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const selectedItem = useCanvasStore((state) => state.selectedItem);

    const handleItemNameChange = (items: CanvasItem[], item: CanvasItem, newName: string): CanvasItem[] => {
        return items.map((i) => (i.id === item.id && i.name !== newName ? { ...i, name: newName } : i));
    };

    const handleChangeName = useCallback(
        (newName: string) => {
            if (!selectedItem) return;

            const updatedItems = handleItemNameChange(items, selectedItem, newName);
            setItems(updatedItems);
        },
        [selectedItem, items, setItems],
    );

    const handleChangeDescription = useCallback(
        (newDesc: string) => {
            if (!selectedItem) return;

            const updatedItems = items.map((item) =>
                item.id === selectedItem.id ? { ...item, description: newDesc } : item,
            );
            setItems(updatedItems);
        },
        [selectedItem, items, setItems],
    );

    return {
        handleChangeName,
        handleChangeDescription,
    };
}
