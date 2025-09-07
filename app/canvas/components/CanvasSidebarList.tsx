'use client';

import { CanvasItem } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import CanvasSidebarItem from '@/canvas/components/CanvasSidebarItem';

type CanvasSidebarListProps = {
    filterText: string;
};

export default function CanvasSidebarList({ filterText }: CanvasSidebarListProps) {
    const { selectedItemIds, setSelectedItemIds, setItems } = useCanvasStore();
    const canvasItems = useCanvasStore((state) => state.items);

    const filteredItems = canvasItems.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()));

    const handleChange = (updated: CanvasItem) => {
        const updatedItems = canvasItems.map((i) => (i.id === updated.id ? updated : i));
        setItems(updatedItems);
    };

    return (
        <div className="flex flex-col flex-1 overflow-y-auto m-1 gap-2">
            <ul className="flex flex-col gap-1">
                {filteredItems.length === 0 ? (
                    <li className="p-2 text-gray-400 text-sm">Ничего не найдено.</li>
                ) : (
                    filteredItems.map((item) => (
                        <CanvasSidebarItem
                            key={item.id}
                            canvasItem={item}
                            isSelected={selectedItemIds.includes(item.id)}
                            onSelect={() => setSelectedItemIds([item.id])}
                            onChange={handleChange}
                        />
                    ))
                )}
            </ul>
        </div>
    );
}
