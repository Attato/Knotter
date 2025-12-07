'use client';

import { memo } from 'react';

import { EnumContent } from '@/canvas/components/Parameters/EnumContent';
import { ArrayContent } from '@/canvas/components/Parameters/ArrayContent';
import { BaseParameterContent } from '@/canvas/components/Parameters/BaseParameterContent';

import { useParametersItem, isEnumValue, isArrayValue } from '@/canvas/hooks/Parameters/useParametersItem';

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

        handleBaseNumberInput,
        handleMinNumberInput,
        handleMaxNumberInput,
        getDisplayValue,

        handleDropToEnum,
        handleDropToArray,
        handleDropToArrayEnum,
        updateArrayItemValue,
        updateArrayItemName,
        removeArrayItem,
    } = useParametersItem(parameterId);

    const parameterValue = parameter.value;

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

    return (
        <BaseParameterContent
            parameterId={parameter.id}
            parameterName={parameter.name}
            parameterType={parameterType}
            parameterValue={parameterValue}
            updateParameterName={updateParameterName}
            updateParameter={updateParameter}
            handleBaseNumberInput={handleBaseNumberInput}
            handleMinNumberInput={handleMinNumberInput}
            handleMaxNumberInput={handleMaxNumberInput}
            getDisplayValue={getDisplayValue}
            onRemove={() => onRemoveParameter(parameter.id)}
        />
    );
});
