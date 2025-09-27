'use client';
import { MouseEvent, KeyboardEvent } from 'react';

import { CanvasItem } from '@/canvas/canvas.types';

import { EditableName } from '@/canvas/components/EditableName';

import { GripVertical, ChevronRight } from 'lucide-react';

interface CanvasSidebarItemProps {
    canvasItem: CanvasItem;
    isSelected: boolean;
    onSelect: (e: MouseEvent<HTMLButtonElement>) => void;
    onChange?: (updatedItem: CanvasItem) => void;
    onMouseDown?: () => void;
    onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

export default function CanvasSidebarItem({
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <EditableName
                        name={canvasItem.name}
                        isSelected={isSelected}
                        onChange={(newName) => onChange?.({ ...canvasItem, name: newName })}
                    />
                    <ChevronRight size={14} className="text-gray" />
                </div>

                <GripVertical className="text-gray" size={16} />
            </div>
        </button>
    );
}
