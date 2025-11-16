'use client';

import { memo } from 'react';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { Enum, ArrayItem } from '@/canvas/canvas.types';

import { X } from 'lucide-react';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

import { EnumContent } from './EnumContent';

interface ArrayContentProps {
    item: ArrayItem;
    onUpdateName: (name: string) => void;
    onUpdateValue: (value: number | string | boolean | Enum) => void;
    onRemove: () => void;
    onDropToEnum?: (arrayItemId: string, droppedId: string) => void;
}

export const ArrayContent = memo(function ArrayItemContent({
    item,
    onUpdateName,
    onUpdateValue,
    onRemove,
    onDropToEnum,
}: ArrayContentProps) {
    const Icon = getDynamicIcon(item.type);

    if (item.type === 'enum') {
        return (
            <EnumContent
                enumValue={item.value as Enum}
                name={item.name}
                onUpdateName={onUpdateName}
                onUpdateEnum={onUpdateValue}
                onRemove={onRemove}
                isInsideArray={true}
                onDropToEnum={(droppedId) => onDropToEnum?.(item.id, droppedId)}
            />
        );
    }

    return (
        <div className="flex gap-2 items-center">
            <Icon size={16} className="min-w-4" />
            <EditableName name={item.name} onChange={onUpdateName} className="w-full" />

            {item.type === 'number' && (
                <Input
                    value={item.value.toString()}
                    onChange={(val) => {
                        const num = parseFloat(val);
                        if (!isNaN(num)) onUpdateValue(num);
                    }}
                    className="bg-border border border-ui"
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                />
            )}

            {item.type === 'string' && (
                <Input
                    value={item.value as string}
                    onChange={(val) => onUpdateValue(val)}
                    className="bg-border border border-ui"
                    placeholder="Введите текст..."
                />
            )}

            {item.type === 'boolean' && (
                <div className="flex items-center w-full h-9">
                    <Checkbox
                        checked={item.value as boolean}
                        onChange={(checked) => onUpdateValue(checked)}
                        className="bg-border border border-ui"
                    />
                </div>
            )}

            <button onClick={onRemove} className="text-gray cursor-pointer">
                <X size={16} />
            </button>
        </div>
    );
});
