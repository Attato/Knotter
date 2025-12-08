'use client';

import { memo, useState } from 'react';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { Enum, ArrayItem } from '@/canvas/canvas.types';
import { X } from 'lucide-react';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';
import { EnumContent } from './EnumContent';

interface ArrayContentProps {
    arrayValue: ArrayItem[];
    name: string;
    iconType: string;

    updateParameterName: (name: string) => void;
    onUpdateItemName: (id: string, name: string) => void;
    updateArrayItemValue: (id: string, value: number | string | boolean | Enum) => void;
    removeArrayItem: (id: string) => void;

    handleDropToArray: (droppedId: string) => void;
    handleDropToEnum: (arrayItemId: string, droppedId: string) => void;
    onRemoveParameter: () => void;

    updateEnumOptionName: (index: number, newName: string) => void;
}

export const ArrayContent = memo(function ArrayContent({
    arrayValue,
    name,
    iconType,

    updateParameterName,
    onUpdateItemName,
    updateArrayItemValue,
    removeArrayItem,
    handleDropToArray,
    handleDropToEnum,
    onRemoveParameter,

    updateEnumOptionName,
}: ArrayContentProps) {
    const Icon = getDynamicIcon(iconType);
    const [isArrayDragOver, setIsArrayDragOver] = useState(false);

    const DATA_TYPES = ['number', 'string', 'boolean', 'enum'] as const;

    return (
        <div className="flex flex-col gap-1 px-3 py-2 bg-depth-2 text-sm rounded-md">
            <div className="flex items-center gap-1 h-8">
                <Icon size={16} className="min-w-4" />

                <EditableName name={name} onChange={updateParameterName} className="w-full" />

                <button onClick={onRemoveParameter} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-col gap-1 border-l pl-6 border-depth-6">
                {arrayValue.map((item) => {
                    const ItemIcon = getDynamicIcon(item.type);

                    if (item.type === 'enum') {
                        return (
                            <EnumContent
                                key={item.id}
                                enumValue={item.value as Enum}
                                name={item.name}
                                isInsideArray={true}
                                updateParameterName={(newName) => onUpdateItemName(item.id, newName)}
                                updateEnumOption={(val) => updateArrayItemValue(item.id, val)}
                                updateEnumOptionName={(index, newName) => updateEnumOptionName(index, newName)}
                                removeEnumItem={() => removeArrayItem(item.id)}
                                handleDropToEnum={(dropped) => handleDropToEnum(item.id, dropped)}
                            />
                        );
                    }

                    return (
                        <div key={item.id} className="flex gap-2 items-center">
                            <ItemIcon size={16} className="min-w-4" />

                            <EditableName
                                name={item.name}
                                onChange={(newName) => onUpdateItemName(item.id, newName)}
                                className="w-full"
                            />

                            {item.type === 'number' && (
                                <Input
                                    value={item.value.toString()}
                                    onChange={(val) => {
                                        const num = parseFloat(val);
                                        if (!isNaN(num)) updateArrayItemValue(item.id, num);
                                    }}
                                    className="bg-depth-3 border border-depth-4"
                                    type="text"
                                    placeholder="0"
                                />
                            )}

                            {item.type === 'string' && (
                                <Input
                                    value={item.value as string}
                                    onChange={(val) => updateArrayItemValue(item.id, val)}
                                    className="bg-depth-3 border border-depth-4"
                                    placeholder="Введите текст..."
                                />
                            )}

                            {item.type === 'boolean' && (
                                <div className="flex items-center w-full h-9">
                                    <Checkbox
                                        checked={item.value as boolean}
                                        onChange={(checked) => updateArrayItemValue(item.id, checked)}
                                        className="bg-depth-3 border border-depth-4"
                                    />
                                </div>
                            )}

                            <button onClick={() => removeArrayItem(item.id)} className="text-gray cursor-pointer">
                                <X size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>

            <div
                className={`flex flex-col gap-2 rounded-md p-2 border border-dashed border-depth-6 
                    ${isArrayDragOver && 'bg-bg-accent/10 border-text-accent'} 
                    ${arrayValue.length > 0 && 'mt-2'}
                `}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsArrayDragOver(true)}
                onDragLeave={() => setIsArrayDragOver(false)}
                onDrop={(e) => {
                    setIsArrayDragOver(false);

                    const droppedId = e.dataTransfer.getData('application/parameter-id');
                    const droppedType = e.dataTransfer.getData('application/parameter-type');

                    if (['string', 'number', 'boolean', 'enum'].includes(droppedType)) {
                        handleDropToArray(droppedId);
                    }
                }}
            >
                <div className="flex flex-wrap items-center justify-center py-16 gap-2 text-center">
                    Перетащите сюда
                    {DATA_TYPES.map((type, idx, arr) => {
                        const IconType = getDynamicIcon(type);

                        const TYPE_LABELS = {
                            number: 'Число',
                            string: 'Текст',
                            boolean: 'Флаг',
                            enum: 'Список',
                        };

                        const label = TYPE_LABELS[type];

                        return (
                            <div key={type} className="flex items-center gap-2">
                                <div className="flex items-center gap-2 bg-bg-accent/10 px-2 py-1 rounded-md text-text-accent">
                                    <IconType size={16} />
                                    {label}
                                </div>

                                {idx < arr.length - 1 && <span> или</span>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});
