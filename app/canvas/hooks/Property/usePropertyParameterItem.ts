'use client';

import { useCallback, useMemo } from 'react';

import { PropertyType, ParameterValue, Enum, ArrayItem, Parameter } from '@/canvas/canvas.types';

import {
    isNumberValue,
    isStringValue,
    isBooleanValue,
    isEnumValue,
    isArrayValue,
} from '@/canvas/hooks/Parameters/useParametersItem';

const getDisplayText = (option: { id: string; name?: string; value?: string }) => {
    return option.value || option.name || option.id;
};

const useEnumData = (parameterValue: ParameterValue) => {
    return useMemo(() => {
        if (!isEnumValue(parameterValue)) return null;

        const enumData = parameterValue as Enum;
        const options = Array.isArray(enumData.options) ? enumData.options : [];

        const notSelectedOption = { display: 'Не выбрано', id: null };

        const displayOptions = [
            notSelectedOption,
            ...options.map((option) => ({
                display: getDisplayText(option),
                id: option.id,
            })),
        ];

        let selectedDisplay = notSelectedOption.display;

        if (enumData.selectedId !== null) {
            const selectedOption = options.find((option) => option.id === enumData.selectedId);

            if (selectedOption) {
                selectedDisplay = getDisplayText(selectedOption);
            }
        }

        return {
            selectedDisplay,
            options: displayOptions.map((opt) => opt.display),
            rawOptions: options,
        };
    }, [parameterValue]);
};

const useArrayData = (parameterValue: ParameterValue) => {
    return useMemo(() => {
        if (!isArrayValue(parameterValue)) return null;
        return Array.isArray(parameterValue) ? parameterValue : [];
    }, [parameterValue]);
};

interface usePropertyParameterItemProps {
    parameter: Parameter;
    handleUpdateParameter: (updates: Partial<PropertyType>) => void;
}

export const usePropertyParameterItem = ({ parameter, handleUpdateParameter }: usePropertyParameterItemProps) => {
    const updateValue = useCallback(
        (value: ParameterValue) => {
            handleUpdateParameter({ value });
        },
        [handleUpdateParameter],
    );

    const handleNumber = useCallback(
        (text: string) => {
            const number = parseFloat(text);
            updateValue(isNaN(number) ? 0 : number);
        },
        [updateValue],
    );

    const handleString = useCallback(
        (text: string) => {
            updateValue(text);
        },
        [updateValue],
    );

    const handleBoolean = useCallback(
        (checked: boolean) => {
            updateValue(checked);
        },
        [updateValue],
    );

    const enumData = useEnumData(parameter.value);
    const arrayData = useArrayData(parameter.value);

    const handleEnum = useCallback(
        (selectedText: string) => {
            if (!isEnumValue(parameter.value) || !enumData) return;

            const enumValue = parameter.value as Enum;
            const notSelectedText = 'Не выбрано';

            if (selectedText === notSelectedText) {
                updateValue({ ...enumValue, selectedId: null });
            } else {
                const selectedOption = enumData.rawOptions.find((option) => getDisplayText(option) === selectedText);

                updateValue({
                    ...enumValue,
                    selectedId: selectedOption?.id ?? null,
                });
            }
        },
        [parameter.value, updateValue, enumData],
    );

    const handleArrayItem = useCallback(
        (itemId: string, newValue: boolean | string | number, itemType: 'boolean' | 'string' | 'number') => {
            if (!isArrayValue(parameter.value)) return;

            const currentArray = Array.isArray(parameter.value) ? parameter.value : [];

            const updatedArray = currentArray.map((item) =>
                item.id === itemId ? ({ ...item, value: newValue, type: itemType } as ArrayItem) : item,
            );

            updateValue(updatedArray);
        },
        [parameter.value, updateValue],
    );

    const parameterType = useMemo(
        () => ({
            isNumber: isNumberValue(parameter.value),
            isString: isStringValue(parameter.value),
            isBoolean: isBooleanValue(parameter.value),
            isEnum: isEnumValue(parameter.value),
            isArray: isArrayValue(parameter.value),
        }),
        [parameter.value],
    );

    return {
        updateValue,
        handleNumber,
        handleString,
        handleBoolean,
        handleEnum,
        handleArrayItem,

        enumData,
        arrayData,

        parameterType,
        value: parameter.value,
        name: parameter.name,
    };
};
