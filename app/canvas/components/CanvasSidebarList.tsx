'use client';

import CanvasSidebarItem from '@/canvas/components/CanvasSidebarItem';

import { useCanvasSidebarList } from '@/canvas/hooks/useCanvasSidebarList';

type CanvasSidebarListProps = {
    filterText: string;
};

export default function CanvasSidebarList({ filterText }: CanvasSidebarListProps) {
    const { filteredItems, handleChange, handleSelect, handleKeyDown, handleDeselectOnEmptyClick, selectedItemIds } =
        useCanvasSidebarList(filterText);

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
                            onSelect={(e) => handleSelect(e, item.id)}
                            onChange={handleChange}
                            onKeyDown={(e) => handleKeyDown(e, item)}
                        />
                    ))
                )}
            </ul>
        </div>
    );
}
