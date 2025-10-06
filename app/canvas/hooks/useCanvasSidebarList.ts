'use client';

import { useMemo, useCallback } from 'react';
import { CanvasItem } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { selectCanvasItem } from '@/canvas/utils/selectCanvasItem';

export function useCanvasSidebarList(filterText: string) {
    const canvasItems = useCanvasStore((state) => state.items);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const setSelectedItemIds = useCanvasStore((state) => state.setSelectedItemIds);
    const setItems = useCanvasStore((state) => state.setItems);

    const filteredItems = useMemo(
        () => canvasItems.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase())),
        [canvasItems, filterText],
    );

    const handleChange = useCallback(
        (updated: CanvasItem) => {
            const updatedItems = canvasItems.map((i) => (i.id === updated.id ? updated : i));
            setItems(updatedItems);
        },
        [canvasItems, setItems],
    );

    const handleSelect = useCallback(
        (e: React.MouseEvent, itemId: string) => {
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
        },
        [canvasItems, selectedItemIds, setSelectedItemIds],
    );

    const handleDeselectOnEmptyClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                setSelectedItemIds([]);
            }
        },
        [setSelectedItemIds],
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent, item: CanvasItem) => {
            if (e.key !== 'Enter') return;
            const isSelected = selectedItemIds.includes(item.id);

            if (!isSelected) {
                setSelectedItemIds([...selectedItemIds, item.id]);
            }
        },
        [selectedItemIds, setSelectedItemIds],
    );

    return {
        filteredItems,
        handleChange,
        handleSelect,
        handleKeyDown,
        handleDeselectOnEmptyClick,
        selectedItemIds,
    };
}
