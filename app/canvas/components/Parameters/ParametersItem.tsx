'use client';

import { memo, useState } from 'react';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { EnumContent } from '@/canvas/components/Parameters/EnumContent';
import { ArrayContent } from '@/canvas/components/Parameters/ArrayContent';

import {
    useParametersItem,
    isNumberValue,
    isStringValue,
    isBooleanValue,
    isEnumValue,
    isArrayValue,
} from '@/canvas/hooks/Parameters/useParametersItem';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

import { X } from 'lucide-react';

interface ParametersItemProps {
    parameterId: string;
    onRemoveParameter: (id: string) => void;
}

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
                        <ArrayContent
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
