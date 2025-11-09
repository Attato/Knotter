'use client';

import { useCallback } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { handleItemNameChange } from '@/canvas/utils/items/handleItemNameChange';

export function useInspector() {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const selectedItem = useCanvasStore((state) => state.selectedItem);

    const handleChangeName = useCallback(
        (newName: string) => {
            if (!selectedItem) return;

            handleItemNameChange(selectedItem, newName);
        },
        [selectedItem],
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
