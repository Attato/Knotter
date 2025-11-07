'use client';

import { memo, useState } from 'react';
import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';
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

export const ParametersItem = memo(function ParametersItem({ parameterId, onRemoveParameter }: ParametersItemProps) {
    const {
        parameter,
        parameterType,
        updateParameter,
        updateParameterName,
        updateEnumOption,
        updateEnumOptionName,
        handleNumberInput,
        getDisplayValue,
        handleDropToEnum,
        handleDropToArray,
        updateArrayItemValue,
        updateArrayItemName,
        removeArrayItem,
    } = useParametersItem(parameterId);

    const parameterValue = parameter.value;
    const Icon = getDynamicIcon(parameterType);

    const [isEnumDragOver, setIsEnumDragOver] = useState(false);
    const [isArrayDragOver, setIsArrayDragOver] = useState(false);

    const renderBaseParameter = () => (
        <div
            className="flex flex-col justify-center gap-2 px-3 py-1 min-h-[44px] text-sm bg-card rounded-md transition-all"
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('application/parameter-id', parameter.id);
                e.dataTransfer.setData('application/parameter-type', parameterType);
            }}
        >
            <div className="flex items-center gap-1 h-[36px]">
                <Icon size={16} className="min-w-4" />

                <EditableName name={parameter.name} onChange={updateParameterName} className="w-full" />

                {isNumberValue(parameterValue) && (
                    <Input
                        value={getDisplayValue()}
                        onChange={handleNumberInput}
                        className="bg-ui w-24"
                        max={16}
                        type="text"
                        inputMode="decimal"
                    />
                )}

                {isStringValue(parameterValue) && (
                    <Input
                        value={parameterValue}
                        onChange={(val) => updateParameter(val)}
                        className="bg-ui w-48"
                        max={16}
                        placeholder="Введите текст..."
                    />
                )}

                {isBooleanValue(parameterValue) && (
                    <div className="w-full">
                        <Checkbox checked={parameterValue} onChange={(checked) => updateParameter(checked)} />
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
        const enumValue = parameterValue;

        return (
            <div
                draggable={false}
                className="flex flex-col gap-2 px-3 py-2 min-h-[44px] text-sm bg-card rounded-md transition-all"
            >
                <div className="flex items-center gap-1 h-[36px]">
                    <Icon size={16} className="min-w-4" />

                    <EditableName name={parameter.name} onChange={updateParameterName} className="w-full" />

                    <button onClick={() => onRemoveParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                        <X size={16} />
                    </button>
                </div>

                <div
                    className={`flex flex-col gap-2 rounded-md p-2 border-2 border-dashed transition-all ${
                        isEnumDragOver ? 'bg-ui-hover border-primary' : 'border-border-light'
                    }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setIsEnumDragOver(true)}
                    onDragLeave={() => setIsEnumDragOver(false)}
                    onDrop={(e) => {
                        setIsEnumDragOver(false);

                        const droppedId = e.dataTransfer.getData('application/parameter-id');
                        const droppedType = e.dataTransfer.getData('application/parameter-type');

                        if (droppedType === 'string') handleDropToEnum(droppedId);
                    }}
                >
                    <div className="flex flex-wrap items-center justify-center gap-2 text-gray text-center pointer-events-none">
                        Перетащите сюда
                        <div className="flex items-center gap-2 bg-ui px-2 py-1 rounded-md">
                            {(() => {
                                const Icon = getDynamicIcon('string');
                                return <Icon size={16} />;
                            })()}
                            Текст
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1 mt-2">
                    {enumValue.options.values.map((item, idx) => {
                        const Icon = getDynamicIcon('string');

                        return (
                            <div key={item.id} className="flex gap-2 items-center bg-border rounded-md px-3 py-1">
                                <Icon size={16} className="min-w-4" />

                                <EditableName
                                    name={item.name}
                                    onChange={(newName) => updateEnumOptionName(idx, newName)}
                                    className="w-full"
                                />

                                <Input
                                    value={item.value}
                                    onChange={(val) => updateEnumOption(item.id, val)}
                                    className="bg-ui border border-ui-hover"
                                    max={16}
                                    placeholder="Введите значение..."
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderArrayParameter = () => {
        if (!isArrayValue(parameterValue)) return null;

        const arrayValue = parameterValue;

        return (
            <div
                draggable={false}
                className="flex flex-col gap-1 px-3 py-2 min-h-[44px] bg-card text-sm rounded-md transition-all"
            >
                <div className="flex items-center gap-1 h-[36px]">
                    <Icon size={16} className="min-w-4" />

                    <EditableName name={parameter.name} onChange={updateParameterName} className="w-full" />

                    <button onClick={() => onRemoveParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                        <X size={16} />
                    </button>
                </div>
                <div
                    className={`flex flex-col gap-2 rounded-md p-2 border-2 border-dashed transition-all ${
                        isArrayDragOver ? 'bg-ui-hover border-primary' : 'border-border-light'
                    }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={() => setIsArrayDragOver(true)}
                    onDragLeave={() => setIsArrayDragOver(false)}
                    onDrop={(e) => {
                        setIsArrayDragOver(false);

                        const droppedId = e.dataTransfer.getData('application/parameter-id');
                        const droppedType = e.dataTransfer.getData('application/parameter-type');

                        if (['string', 'number', 'boolean'].includes(droppedType)) handleDropToArray(droppedId);
                    }}
                >
                    <div className="flex flex-wrap items-center justify-center gap-2 text-gray text-center pointer-events-none">
                        Перетащите сюда
                        {['number', 'string', 'boolean'].map((type, idx, arr) => {
                            const Icon = getDynamicIcon(type as 'number' | 'string' | 'boolean');

                            const label = (() => {
                                if (type === 'number') return 'Число';
                                if (type === 'string') return 'Текст';
                                if (type === 'boolean') return 'Флаг';

                                return '';
                            })();

                            return (
                                <span key={type} className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 bg-ui px-2 py-1 rounded-md">
                                        <Icon size={16} />
                                        {label}
                                    </div>

                                    {idx < arr.length - 1 && <span> или</span>}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-1 mt-2">
                    {arrayValue.map((item) => {
                        const Icon = getDynamicIcon(typeof item.value as 'number' | 'string' | 'boolean');

                        return (
                            <div key={item.id} className="flex gap-2 items-center bg-border rounded-md px-3 py-1">
                                <Icon size={16} className="min-w-4" />

                                <EditableName
                                    name={item.name}
                                    onChange={(newName) => updateArrayItemName(item.id, newName)}
                                    className="w-full"
                                />

                                {typeof item.value === 'number' && (
                                    <Input
                                        value={item.value.toString()}
                                        onChange={(val) => {
                                            const num = parseFloat(val);
                                            if (!isNaN(num)) updateArrayItemValue(item.id, num);
                                        }}
                                        className="bg-ui border border-ui-hover"
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0"
                                    />
                                )}

                                {typeof item.value === 'string' && (
                                    <Input
                                        value={item.value}
                                        onChange={(val) => updateArrayItemValue(item.id, val)}
                                        className="bg-ui border border-ui-hover"
                                        placeholder="Введите текст..."
                                    />
                                )}

                                {typeof item.value === 'boolean' && (
                                    <div className="flex items-center w-full h-9">
                                        <Checkbox
                                            checked={item.value}
                                            onChange={(checked) => updateArrayItemValue(item.id, checked)}
                                            className="bg-ui border border-ui-hover"
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
            </div>
        );
    };

    if (isEnumValue(parameterValue)) return renderEnumParameter();
    if (isArrayValue(parameterValue)) return renderArrayParameter();

    return renderBaseParameter();
});
