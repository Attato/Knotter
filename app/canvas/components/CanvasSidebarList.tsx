'use client';

import { CanvasItem } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import CanvasSidebarItem from '@/canvas/components/CanvasSidebarItem';
import { selectCanvasItem } from '@/canvas/utils/selectCanvasItem';

type CanvasSidebarListProps = {
    filterText: string;
    onItemDoubleClick?: (item: CanvasItem) => void;
};

export default function CanvasSidebarList({ filterText, onItemDoubleClick }: CanvasSidebarListProps) {
    const { selectedItemIds, setSelectedItemIds, setItems } = useCanvasStore();
    const canvasItems = useCanvasStore((state) => state.items);

    const filteredItems = canvasItems.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()));

    const handleChange = (updated: CanvasItem) => {
        const updatedItems = canvasItems.map((i) => (i.id === updated.id ? updated : i));
        setItems(updatedItems);
    };

    const handleSelect = (e: React.MouseEvent, itemId: string) => {
        const newSelectedIds = selectCanvasItem(canvasItems, selectedItemIds, itemId, e);
        setSelectedItemIds(newSelectedIds);
    };

    return (
        <div className="flex flex-col flex-1 overflow-y-auto m-1 gap-2">
            <ul className="flex flex-col gap-1">
                {filteredItems.length === 0 ? (
                    <li className="p-2 text-[#999] text-sm text-center">Ничего не найдено.</li>
                ) : (
                    filteredItems.map((item) => (
                        <CanvasSidebarItem
                            key={item.id}
                            canvasItem={item}
                            isSelected={selectedItemIds.includes(item.id)}
                            onSelect={(e) => handleSelect(e, item.id)}
                            onChange={handleChange}
                            onDoubleClick={() => onItemDoubleClick?.(item)}
                        />
                    ))
                )}
            </ul>
        </div>
    );
}
