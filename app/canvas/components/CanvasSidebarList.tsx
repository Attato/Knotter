'use client';

import CanvasSidebarItem from '@/canvas/components/CanvasSidebarItem';

import { useCanvasSidebarList } from '@/canvas/hooks/useCanvasSidebarList';

import { handleOpenInspector } from '@/canvas/utils/handleOpenInspector';

type CanvasSidebarListProps = {
    filterText: string;
};

export default function CanvasSidebarList({ filterText }: CanvasSidebarListProps) {
    const { filteredItems, handleChange, handleSelect, handleKeyDown, selectedItemIds } = useCanvasSidebarList(filterText);

    return (
        <div className="flex flex-col flex-1 overflow-y-auto m-1 gap-2">
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
                            onDoubleClick={() => handleOpenInspector?.(item)}
                            onKeyDown={(e) => handleKeyDown(e, item)}
                        />
                    ))
                )}
            </ul>
        </div>
    );
}
