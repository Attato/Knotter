'use client';

import { memo, useState } from 'react';

import { v4 as uuid } from 'uuid';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';

import { Enum } from '@/canvas/canvas.types';

import { X } from 'lucide-react';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

interface EnumContentProps {
    enumValue: Enum;
    name: string;
    parameterId?: string;
    onUpdateName: (name: string) => void;
    onUpdateEnum: (updatedEnum: Enum) => void;
    onRemove?: () => void;
    isInsideArray?: boolean;
    onDropToEnum?: (droppedId: string) => void;
}

export const EnumContent = memo(function EnumContent({
    enumValue,
    name,
    parameterId,
    onUpdateName,
    onUpdateEnum,
    onRemove,
    isInsideArray = false,
    onDropToEnum,
}: EnumContentProps) {
    const Icon = getDynamicIcon('enum');
    const [isDragOver, setIsDragOver] = useState(false);

    const handleAddDefaultOption = () => {
        const ordinalNumber = enumValue.options.length + 1;

        const newOption = {
            id: uuid(),
            name: `${ordinalNumber}.`,
            value: '',
        };

        const updatedEnum: Enum = {
            ...enumValue,
            options: [...enumValue.options, newOption],
        };

        onUpdateEnum(updatedEnum);
    };

    const updateEnumOption = (itemId: string, newValue: string) => {
        const updated: Enum = {
            ...enumValue,
            options: enumValue.options.map((item) => (item.id === itemId ? { ...item, value: newValue } : item)),
        };
        onUpdateEnum(updated);
    };

    const updateEnumOptionName = (index: number, newName: string) => {
        const updated: Enum = {
            ...enumValue,
            options: enumValue.options.map((o, i) => (i === index ? { ...o, name: newName } : o)),
        };
        onUpdateEnum(updated);
    };

    const removeEnumItem = (itemId: string) => {
        const updated: Enum = {
            ...enumValue,
            options: enumValue.options.filter((item) => item.id !== itemId),
        };

        if (enumValue.selectedId === itemId) {
            updated.selectedId = updated.options[0]?.id || null;
        }

        onUpdateEnum(updated);
    };

    const handleDrop = (e: React.DragEvent) => {
        setIsDragOver(false);

        const droppedId = e.dataTransfer.getData('application/parameter-id');
        const droppedType = e.dataTransfer.getData('application/parameter-type');

        if (droppedType === 'string' && onDropToEnum) {
            onDropToEnum(droppedId);
        }
    };

    return (
        <div
            className={`flex flex-col gap-1 text-sm rounded-md ${!isInsideArray && 'bg-card px-3 py-2'}`}
            draggable={!isInsideArray}
            onDragStart={(e) => {
                if (!isInsideArray && parameterId) {
                    e.dataTransfer.setData('application/parameter-id', parameterId);
                    e.dataTransfer.setData('application/parameter-type', 'enum');
                }
            }}
        >
            <div className="flex items-center gap-1 h-8">
                <Icon size={16} className="min-w-4" />

                <EditableName name={name} onChange={onUpdateName} className="w-full" />

                {onRemove && (
                    <button onClick={onRemove} className="ml-auto text-gray cursor-pointer">
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-1 border-l border-border-light pl-6">
                {enumValue.options.map((item, idx) => {
                    const Icon = getDynamicIcon('string');

                    return (
                        <div key={item.id} className={`flex gap-2 items-center rounded-md`}>
                            <Icon size={16} className="min-w-4" />

                            <EditableName
                                name={item.name}
                                onChange={(newName) => updateEnumOptionName(idx, newName)}
                                className="w-full"
                            />

                            <Input
                                value={item.value}
                                onChange={(val) => updateEnumOption(item.id, val)}
                                className="border bg-border border-ui"
                                max={16}
                                placeholder="Введите значение..."
                            />

                            <button onClick={() => removeEnumItem(item.id)} className="text-gray cursor-pointer">
                                <X size={16} />
                            </button>
                        </div>
                    );
                })}

                <div
                    className={`flex flex-col gap-1 rounded-md p-2 border border-dashed border-border-light hover:bg-bg-accent/10 hover:border-text-accent cursor-pointer ${
                        isDragOver && 'bg-bg-accent/10 border-text-accent'
                    } ${enumValue.options.length > 0 && 'mt-2'}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setIsDragOver(true)}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={handleAddDefaultOption}
                >
                    <div className="flex flex-wrap items-center justify-center py-4 gap-2 text-center pointer-events-none">
                        <span>Кликните чтобы добавить параметр</span>
                        <div className="flex items-center gap-2 bg-bg-accent/10 px-2 py-1 rounded-md text-text-accent">
                            {(() => {
                                const StringIcon = getDynamicIcon('string');
                                return <StringIcon size={16} />;
                            })()}
                            Текст
                        </div>
                        <span className="text-xs text-gray">или перетащите сюда готовый текстовый параметр</span>
                    </div>
                </div>
            </div>
        </div>
    );
});
