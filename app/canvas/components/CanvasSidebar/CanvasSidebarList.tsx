'use client';

import { memo, useState } from 'react';
import { Search } from 'lucide-react';

import { CanvasSidebarItem } from '@/canvas/components/CanvasSidebar/CanvasSidebarItem';

import { useCanvasSidebarList } from '@/canvas/hooks/CanvasSidebar/useCanvasSidebarList';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';

export const CanvasSidebarList = memo(function CanvasSidebarList() {
    const [filterText, setFilterText] = useState('');

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
        <div className="flex flex-col flex-1 overflow-hidden">
            <div className="h-[42px]">
                <div className="flex items-center gap-2 m-1">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="w-full h-8 bg-card text-foreground placeholder-gray pl-3 pr-9 text-sm rounded-md focus:outline-none"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray" size={14} />
                    </div>
                </div>
                <hr className="border-b-0 border-border" />
            </div>

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
                                <li className="p-2 text-gray text-sm text-center">Ничего не найдено</li>
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
        </div>
    );
});
