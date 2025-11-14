'use client';

import { memo, useState } from 'react';

import { v4 as uuid } from 'uuid';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { Enum, ArrayItem } from '@/canvas/canvas.types';

import { X } from 'lucide-react';

import {
    useParametersItem,
    isNumberValue,
    isStringValue,
    isBooleanValue,
    isEnumValue,
    isArrayValue,
} from '@/canvas/hooks/Parameters/useParametersItem';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

interface ParametersItemProps {
    parameterId: string;
    onRemoveParameter: (id: string) => void;
}

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

const EnumContent = memo(function EnumContent({
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
        const newOption = {
            id: uuid(),
            name: 'Текст',
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

interface ArrayItemContentProps {
    item: ArrayItem;
    onUpdateName: (name: string) => void;
    onUpdateValue: (value: number | string | boolean | Enum) => void;
    onRemove: () => void;
    onDropToEnum?: (arrayItemId: string, droppedId: string) => void;
}

const ArrayItemContent = memo(function ArrayItemContent({
    item,
    onUpdateName,
    onUpdateValue,
    onRemove,
    onDropToEnum,
}: ArrayItemContentProps) {
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

export const ParametersItem = memo(function ParametersItem({ parameterId, onRemoveParameter }: ParametersItemProps) {
    const {
        parameter,
        parameterType,
        updateParameter,
        updateParameterName,
        handleNumberInput,
        getDisplayValue,
        handleDropToEnum,
        handleDropToArray,
        handleDropToArrayEnum,
        updateArrayItemValue,
        updateArrayItemName,
        removeArrayItem,
    } = useParametersItem(parameterId);

    const parameterValue = parameter.value;
    const Icon = getDynamicIcon(parameterType);

    const [isArrayDragOver, setIsArrayDragOver] = useState(false);

    const renderBaseParameter = () => (
        <div
            className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-card rounded-md"
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('application/parameter-id', parameter.id);
                e.dataTransfer.setData('application/parameter-type', parameterType);
            }}
        >
            <div className="flex items-center gap-1">
                <Icon size={16} className="min-w-4" />

                <EditableName name={parameter.name} onChange={updateParameterName} className="w-full" />

                {isNumberValue(parameterValue) && (
                    <Input
                        value={getDisplayValue()}
                        onChange={handleNumberInput}
                        className="bg-border border border-ui"
                        max={16}
                        type="text"
                        inputMode="decimal"
                    />
                )}

                {isStringValue(parameterValue) && (
                    <Input
                        value={parameterValue}
                        onChange={(val) => updateParameter(val)}
                        className="bg-border border border-ui"
                        max={16}
                        placeholder="Введите текст..."
                    />
                )}

                {isBooleanValue(parameterValue) && (
                    <div className="w-full">
                        <Checkbox
                            checked={parameterValue}
                            onChange={(checked) => updateParameter(checked)}
                            className="bg-border border border-ui"
                        />
                    </div>
                )}

                <button onClick={() => onRemoveParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>
        </div>
    );

    const renderEnumParameter = () => {
        if (!isEnumValue(parameterValue)) return null;
        return (
            <EnumContent
                enumValue={parameterValue}
                name={parameter.name}
                parameterId={parameter.id}
                onUpdateName={updateParameterName}
                onUpdateEnum={updateParameter}
                onRemove={() => onRemoveParameter(parameter.id)}
                onDropToEnum={handleDropToEnum}
            />
        );
    };

    const renderArrayParameter = () => {
        if (!isArrayValue(parameterValue)) return null;

        const arrayValue = parameterValue;

        return (
            <div className="flex flex-col gap-1 px-3 py-2 bg-card text-sm rounded-md">
                <div className="flex items-center gap-1 h-8">
                    <Icon size={16} className="min-w-4" />

                    <EditableName name={parameter.name} onChange={updateParameterName} className="w-full" />

                    <button onClick={() => onRemoveParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-col gap-1 border-l pl-6 border-border-light">
                    {arrayValue.map((item) => (
                        <ArrayItemContent
                            key={item.id}
                            item={item}
                            onUpdateName={(newName) => updateArrayItemName(item.id, newName)}
                            onUpdateValue={(newValue) => updateArrayItemValue(item.id, newValue)}
                            onRemove={() => removeArrayItem(item.id)}
                            onDropToEnum={handleDropToArrayEnum}
                        />
                    ))}
                </div>

                <div
                    className={`flex flex-col gap-2 rounded-md p-2 border border-dashed border-border-light ${
                        isArrayDragOver && 'bg-bg-accent/10 border-text-accent'
                    } ${arrayValue.length > 0 && 'mt-2'}`}
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
                    <div className="flex flex-wrap items-center justify-center py-16 gap-2 text-center pointer-events-none">
                        Перетащите сюда
                        {['number', 'string', 'boolean', 'enum'].map((type, idx, arr) => {
                            const Icon = getDynamicIcon(type as 'number' | 'string' | 'boolean' | 'enum');

                            const label = (() => {
                                if (type === 'number') return 'Число';
                                if (type === 'string') return 'Текст';
                                if (type === 'boolean') return 'Флаг';
                                if (type === 'enum') return 'Список';

                                return '';
                            })();

                            return (
                                <div key={type} className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 bg-bg-accent/10 px-2 py-1 rounded-md text-text-accent">
                                        <Icon size={16} />
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
    };

    if (isEnumValue(parameterValue)) return renderEnumParameter();
    if (isArrayValue(parameterValue)) return renderArrayParameter();

    return renderBaseParameter();
});
