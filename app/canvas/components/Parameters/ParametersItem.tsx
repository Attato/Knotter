'use client';

import { memo } from 'react';

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

    if (isEnumValue(parameterValue)) {
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
    }

    if (isArrayValue(parameterValue)) {
        return (
            <ArrayContent
                arrayValue={parameterValue}
                name={parameter.name}
                iconType={parameterType}
                onUpdateName={updateParameterName}
                onUpdateItemName={updateArrayItemName}
                onUpdateItemValue={updateArrayItemValue}
                onRemoveItem={removeArrayItem}
                onDropToArray={handleDropToArray}
                onDropToArrayEnum={handleDropToArrayEnum}
                onRemoveArray={() => onRemoveParameter(parameter.id)}
            />
        );
    }

    return renderBaseParameter();
});
