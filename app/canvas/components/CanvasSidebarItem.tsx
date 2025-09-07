'use client';

import { CanvasItem } from '@/canvas/canvas.types';
import { EditableName } from '@/canvas/components/EditableName';
import { GripVertical, ChevronRight } from 'lucide-react';

interface CanvasSidebarItemProps {
    canvasItem: CanvasItem;
    isSelected: boolean;
    onSelect: () => void;
    onChange?: (updatedItem: CanvasItem) => void;
    onMouseDown?: () => void;
}

export default function CanvasSidebarItem({
    canvasItem,
    isSelected,
    onSelect,
    onChange,
    onMouseDown,
}: CanvasSidebarItemProps) {
    return (
        <button
            onMouseDown={onMouseDown}
            className={`w-full px-4 py-2 rounded-md tabular-nums transition-all duration-150 cursor-pointer ${
                isSelected ? 'bg-[#388bfd1a]' : 'bg-[#151515] hover:bg-[#1a1a1a]'
            }`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <EditableName
                        name={canvasItem.name}
                        isSelected={isSelected}
                        onChange={(newName) => onChange?.({ ...canvasItem, name: newName })}
                    />
                    <ChevronRight size={14} className="text-[#888]" />
                </div>
                <GripVertical color="#999" size={16} />
            </div>
        </button>
    );
}
