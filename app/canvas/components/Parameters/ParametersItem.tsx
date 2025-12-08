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

        updateEnumOption,
        updateEnumOptionName,
        removeEnumItem,
        handleAddDefaultOption,

        handleDropToEnum,
        handleDropToArray,
        handleDropToArrayEnum,
        updateArrayItemValue,
        updateArrayItemName,
        removeArrayItem,
    } = useParametersItem(parameterId);

    if (isEnumValue(parameter.value)) {
        return (
            <EnumContent
                enumValue={parameter.value}
                name={parameter.name}
                parameterId={parameter.id}
                updateParameterName={updateParameterName}
                onRemoveParameter={() => onRemoveParameter(parameter.id)}
                handleDropToEnum={handleDropToEnum}
                updateEnumOption={updateEnumOption}
                updateEnumOptionName={updateEnumOptionName}
                removeEnumItem={removeEnumItem}
                handleAddDefaultOption={handleAddDefaultOption}
            />
        );
    }

    if (isArrayValue(parameter.value)) {
        return (
            <ArrayContent
                arrayValue={parameter.value}
                name={parameter.name}
                iconType={parameterType}
                updateParameterName={updateParameterName}
                onUpdateItemName={updateArrayItemName}
                updateArrayItemValue={updateArrayItemValue}
                removeArrayItem={removeArrayItem}
                handleDropToArray={handleDropToArray}
                handleDropToEnum={handleDropToArrayEnum}
                onRemoveParameter={() => onRemoveParameter(parameter.id)}
                updateEnumOptionName={updateEnumOptionName}
            />
        );
    }

    return (
        <BaseParameterContent
            parameterId={parameter.id}
            parameterName={parameter.name}
            parameterType={parameterType}
            parameterValue={parameter.value}
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
