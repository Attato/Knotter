'use client';
import { MouseEvent, KeyboardEvent, memo } from 'react';

import { CanvasItem } from '@/canvas/canvas.types';
import { EditableName } from '@/canvas/components/EditableName';

import { GripVertical } from 'lucide-react';

interface CanvasSidebarItemProps {
    canvasItem: CanvasItem;
    isSelected: boolean;
    onSelect: (e: MouseEvent<HTMLButtonElement>) => void;
    onChange?: (updatedItem: CanvasItem) => void;
    onMouseDown?: () => void;
    onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

export const CanvasSidebarItem = memo(function CanvasSidebarItem({
    canvasItem,
    isSelected,
    onSelect,
    onChange,
    onMouseDown,
    onKeyDown,
}: CanvasSidebarItemProps) {
    return (
        <button
            onMouseDown={onMouseDown}
            className={`w-full px-4 py-2 rounded-md outline-none tabular-nums cursor-pointer ${
                isSelected ? 'bg-bg-accent/10 focus-visible:bg-bg-accent/15' : 'bg-card hover:bg-ui focus-visible:bg-ui'
            }`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(e);
            }}
            onKeyDown={onKeyDown}
        >
            <div className="flex items-center justify-between gap-2">
                <EditableName
                    name={canvasItem.name}
                    isSelected={isSelected}
                    onChange={(newName) => onChange?.({ ...canvasItem, name: newName })}
                />

                <GripVertical className="text-gray" size={16} />
            </div>
        </button>
    );
});
