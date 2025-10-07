'use client';

import { memo, useCallback } from 'react';

import { CanvasSidebarItem } from '@/canvas/components/CanvasSidebarItem';

import { useCanvasSidebarList } from '@/canvas/hooks/useCanvasSidebarList';

type CanvasSidebarListProps = {
    filterText: string;
};

export const CanvasSidebarList = memo(function CanvasSidebarList({ filterText }: CanvasSidebarListProps) {
    const { filteredItems, handleChange, handleSelect, handleKeyDown, handleDeselectOnEmptyClick, selectedItemIds } =
        useCanvasSidebarList(filterText);

    const getHandleSelect = useCallback(
        (itemId: string) => (e: React.MouseEvent) => handleSelect(e, itemId),
        [handleSelect],
    );

    const getHandleKeyDown = useCallback(
        (itemId: string) => (e: React.KeyboardEvent) => {
            const item = filteredItems.find((i) => i.id === itemId);
            if (item) handleKeyDown(e, item);
        },
        [handleKeyDown, filteredItems],
    );

    return (
        <div className="flex flex-col flex-1 overflow-y-auto m-1 gap-2" onClick={handleDeselectOnEmptyClick}>
            <ul className="flex flex-col gap-1">
                {filteredItems.length === 0 ? (
                    <li className="p-2 text-gray text-sm text-center">Ничего не найдено.</li>
                ) : (
                    filteredItems.map((item) => (
                        <CanvasSidebarItem
                            key={item.id}
                            canvasItem={item}
                            isSelected={selectedItemIds.includes(item.id)}
                            onSelect={getHandleSelect(item.id)}
                            onChange={handleChange}
                            onKeyDown={getHandleKeyDown(item.id)}
                        />
                    ))
                )}
            </ul>
        </div>
    );
});
