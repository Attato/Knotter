'use client';

import { useCallback, useMemo } from 'react';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { handleItemNameChange } from '@/canvas/utils/items/handleItemNameChange';

export function useInspector() {
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);

    const selectedItem = useMemo(() => {
        if (selectedItemIds.length === 0) return null;

        return items.find((item) => item.id === selectedItemIds[0]) ?? null;
    }, [items, selectedItemIds]);

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
        selectedItem,
        handleChangeName,
        handleChangeDescription,
    };
}
