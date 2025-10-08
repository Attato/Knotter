'use client';

import { memo } from 'react';

import { CanvasSidebarItem } from '@/canvas/components/CanvasSidebarItem';

import { useCanvasSidebarList } from '@/canvas/hooks/useCanvasSidebarList';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';

type CanvasSidebarListProps = {
    filterText: string;
};

export const CanvasSidebarList = memo(function CanvasSidebarList({ filterText }: CanvasSidebarListProps) {
    const {
        filteredItems,
        selectedIds,
        handleItemChange,
        handleItemSelect,
        handleItemKeyDown,
        handleDeselectOnEmptyClick,
        handleDragEnd,
    } = useCanvasSidebarList(filterText);

    const sensors = useSensors(useSensor(PointerSensor));

    return (
        <div className="flex flex-col flex-1 overflow-y-auto m-1 gap-2" onClick={handleDeselectOnEmptyClick}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToParentElement]}
            >
                <SortableContext items={filteredItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <ul className="flex flex-col gap-1">
                        {filteredItems.length === 0 ? (
                            <li className="p-2 text-gray text-sm text-center">Ничего не найдено.</li>
                        ) : (
                            filteredItems.map((item) => (
                                <CanvasSidebarItem
                                    key={item.id}
                                    canvasItem={item}
                                    isSelected={selectedIds.includes(item.id)}
                                    onSelect={(e) => handleItemSelect(e, item.id)}
                                    onChange={handleItemChange}
                                    onKeyDown={(e) => handleItemKeyDown(e, item)}
                                />
                            ))
                        )}
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    );
});
