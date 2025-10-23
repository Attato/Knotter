'use client';
import { MouseEvent, KeyboardEvent, memo } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { CanvasItem } from '@/canvas/canvas.types';
import { EditableName } from '@/components/UI/EditableName';

import { GripVertical } from 'lucide-react';

interface HierarchyItemProps {
    canvasItem: CanvasItem;
    isSelected: boolean;
    onSelect: (e: MouseEvent<HTMLButtonElement>) => void;
    onChange?: (updatedItem: CanvasItem) => void;
    onMouseDown?: () => void;
    onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

export const HierarchyItem = memo(function HierarchyItem({
    canvasItem,
    isSelected,
    onSelect,
    onChange,
    onKeyDown,
}: HierarchyItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: canvasItem.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style}>
            <button
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

                    <span {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="text-gray" size={16} />
                    </span>
                </div>
            </button>
        </li>
    );
});
