import { useCanvasStore } from '@/canvas/store/canvasStore';

import { ParameterValue, Enum, ArrayItem, ParameterType, NumberConfig } from '@/canvas/canvas.types';

import { v4 as uuid } from 'uuid';

export const NUMBER_LIMITS = {
    MIN: -999999999,
    MAX: 999999999,
};

const isObject = (value: unknown): value is object => {
    return value !== null && typeof value === 'object';
};

const hasSelectedId = (value: object): value is { selectedId: unknown } => {
    return 'selectedId' in value;
};

const isValidEnum = (value: unknown): value is Enum => {
    return isObject(value) && hasSelectedId(value);
};

const isNumberObject = (value: unknown): value is object => {
    return value !== null && typeof value === 'object';
};

const hasNumberFields = (value: object): value is NumberConfig => {
    return 'base' in value && 'min' in value && 'max' in value;
};

export const isNumberValue = (value: ParameterValue): value is NumberConfig => {
    return isNumberObject(value) && hasNumberFields(value);
};

export const isStringValue = (value: ParameterValue): value is string => {
    return typeof value === 'string';
};

export const isBooleanValue = (value: ParameterValue): value is boolean => {
    return typeof value === 'boolean';
};

export const isEnumValue = (value: ParameterValue): value is Enum => {
    return isValidEnum(value);
};

export const isArrayValue = (value: ParameterValue): value is ArrayItem[] => {
    return Array.isArray(value);
};

export const useParametersItem = (parameterId: string) => {
    const parameters = useCanvasStore((state) => state.parameters);
    const setParameters = useCanvasStore((state) => state.setParameters);

    const parameter = parameters.find((parameter) => parameter.id === parameterId);

    if (!parameter) {
        throw new Error(`Variable with id ${parameterId} not found`);
    }

    const updateParameter = (value: ParameterValue) => {
        setParameters(parameters.map((p) => (p.id === parameterId ? { ...p, value } : p)));
    };

    const updateParameterName = (newName: string) => {
        setParameters(parameters.map((p) => (p.id === parameterId ? { ...p, name: newName } : p)));
    };

    const getParameterType = (): ParameterType => {
        return parameter.type;
    };

    const handleBaseNumberInput = (value: string) => {
        if (!isNumberValue(parameter.value)) return;
        const numValue = parseFloat(value);

        if (!isNaN(numValue) && numValue >= NUMBER_LIMITS.MIN && numValue <= NUMBER_LIMITS.MAX) {
            const clampedValue = Math.max(parameter.value.min, Math.min(numValue, parameter.value.max));

            const newValue: NumberConfig = {
                ...parameter.value,
                base: clampedValue,
            };
            updateParameter(newValue);
        }
    };

    const handleMinNumberInput = (value: string) => {
        if (!isNumberValue(parameter.value)) return;
        const numValue = parseFloat(value);

        if (!isNaN(numValue) && numValue >= NUMBER_LIMITS.MIN) {
            const newMin = Math.min(numValue, parameter.value.max);

            const newBase = Math.max(newMin, parameter.value.base);

            const newValue: NumberConfig = {
                ...parameter.value,
                min: newMin,
                base: newBase,
            };
            updateParameter(newValue);
        }
    };

    const handleMaxNumberInput = (value: string) => {
        if (!isNumberValue(parameter.value)) return;
        const numValue = parseFloat(value);

        if (!isNaN(numValue) && numValue <= NUMBER_LIMITS.MAX) {
            const newMax = Math.max(numValue, parameter.value.min);

            const newBase = Math.min(newMax, parameter.value.base);

            const newValue: NumberConfig = {
                ...parameter.value,
                max: newMax,
                base: newBase,
            };
            updateParameter(newValue);
        }
    };

    const getDisplayValue = (field: 'base' | 'min' | 'max'): string => {
        const { value } = parameter;

        if (isNumberValue(value)) {
            return value[field].toString();
        }

        if (isEnumValue(value)) {
            const selectedOption = value.options.find((opt) => opt.id === value.selectedId);
            return selectedOption?.name || selectedOption?.value || 'Не выбрано';
        }

        return String(value);
    };

    const updateEnumOption = (itemId: string, newValue: string) => {
        if (!isEnumValue(parameter.value)) return;

        const updated: Enum = {
            ...parameter.value,
            options: parameter.value.options.map((item) => (item.id === itemId ? { ...item, value: newValue } : item)),
        };

        updateParameter(updated);
    };

    const updateEnumOptionName = (index: number, newName: string) => {
        if (!isEnumValue(parameter.value)) return;

        const updated: Enum = {
            ...parameter.value,
            options: parameter.value.options.map((o, i) => (i === index ? { ...o, name: newName } : o)),
        };

        updateParameter(updated);
    };

    const removeEnumItem = (itemId: string) => {
        if (!isEnumValue(parameter.value)) return;

        const updated: Enum = {
            ...parameter.value,
            options: parameter.value.options.filter((item) => item.id !== itemId),
        };

        if (parameter.value.selectedId === itemId) {
            updated.selectedId = updated.options[0]?.id || null;
        }

        updateParameter(updated);
    };

    const handleDropToEnum = (droppedId: string) => {
        const droppedParam = parameters.find((p) => p.id === droppedId);

        if (!droppedParam || !isStringValue(droppedParam.value)) return;

        if (!isEnumValue(parameter.value)) return;

        const newOption = {
            id: uuid(),
            name: droppedParam.name,
            value: droppedParam.value,
        };

        const updatedEnum: Enum = {
            ...parameter.value,
            options: [...parameter.value.options, newOption],
        };

        const filtered = parameters.filter((p) => p.id !== droppedId);

        setParameters(filtered.map((p) => (p.id === parameter.id ? { ...parameter, value: updatedEnum } : p)));
    };

    const handleAddDefaultOption = () => {
        if (!isEnumValue(parameter.value)) return;

        const ordinalNumber = parameter.value.options.length + 1;

        const newOption = {
            id: uuid(),
            name: `${ordinalNumber}.`,
            value: '',
        };

        const updated: Enum = {
            ...parameter.value,
            options: [...parameter.value.options, newOption],
        };

        updateParameter(updated);
    };

    const handleDropToArray = (droppedId: string) => {
        const droppedParam = parameters.find((p) => p.id === droppedId);

        if (!droppedParam) return;

        if (!isArrayValue(parameter.value)) return;

        if (!['number', 'string', 'boolean', 'enum'].includes(droppedParam.type)) return;

        let newItem: ArrayItem;

        switch (droppedParam.type) {
            case 'number':
                const numericValue = isNumberValue(droppedParam.value)
                    ? droppedParam.value.base
                    : (droppedParam.value as unknown as number);

                newItem = {
                    id: uuid(),
                    name: droppedParam.name,
                    type: 'number',
                    value: numericValue,
                };
                break;
            case 'string':
                newItem = {
                    id: uuid(),
                    name: droppedParam.name,
                    type: 'string',
                    value: droppedParam.value as string,
                };
                break;
            case 'boolean':
                newItem = {
                    id: uuid(),
                    name: droppedParam.name,
                    type: 'boolean',
                    value: droppedParam.value as boolean,
                };
                break;
            case 'enum':
                newItem = {
                    id: uuid(),
                    name: droppedParam.name,
                    type: 'enum',
                    value: droppedParam.value as Enum,
                };
                break;
            default:
                return;
        }

        const updatedArray = [...parameter.value, newItem];
        const filtered = parameters.filter((p) => p.id !== droppedId);

        setParameters(filtered.map((p) => (p.id === parameter.id ? { ...parameter, value: updatedArray } : p)));
    };

    const handleDropToArrayEnum = (arrayItemId: string, droppedId: string) => {
        const droppedParam = parameters.find((p) => p.id === droppedId);

        if (!droppedParam || typeof droppedParam.value !== 'string') return;

        if (!Array.isArray(parameter.value)) return;

        const updatedArray = parameter.value.map((item) => {
            if (item.id !== arrayItemId || item.type !== 'enum') return item;

            const newOption = {
                id: uuid(),
                name: droppedParam.name,
                value: droppedParam.value as string,
            };

            const updatedEnum: Enum = {
                ...item.value,
                options: [...item.value.options, newOption],
            };

            return { ...item, value: updatedEnum };
        });

        const filtered = parameters.filter((p) => p.id !== droppedId);

        setParameters(filtered.map((p) => (p.id === parameter.id ? { ...parameter, value: updatedArray } : p)));
    };

    const parameterType = getParameterType();

    const convertToNumber = (value: string | number | boolean): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return parseFloat(value) || 0;

        return value ? 1 : 0;
    };

    const convertToBoolean = (value: string | number | boolean): boolean => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value.toLowerCase() === 'true';

        return Boolean(value);
    };

    const convertToString = (value: string | number | boolean): string => {
        return String(value);
    };

    const convertArrayItemValue = (item: ArrayItem, newValue: string | number | boolean | Enum): ArrayItem => {
        switch (item.type) {
            case 'number':
                return {
                    ...item,
                    value: convertToNumber(newValue as string | number | boolean),
                };

            case 'boolean':
                return {
                    ...item,
                    value: convertToBoolean(newValue as string | number | boolean),
                };

            case 'string':
                return {
                    ...item,
                    value: convertToString(newValue as string | number | boolean),
                };

            case 'enum':
                return {
                    ...item,
                    value: newValue as Enum,
                };

            default:
                return item;
        }
    };

    const updateArrayItemValue = (itemId: string, newValue: string | number | boolean | Enum) => {
        if (!isArrayValue(parameter.value)) return;

        const updated = parameter.value.map((item) => {
            if (item.id !== itemId) return item;

            return convertArrayItemValue(item, newValue);
        });

        updateParameter(updated);
    };

    const updateArrayItemName = (itemId: string, newName: string) => {
        if (!isArrayValue(parameter.value)) return;

        const updated = parameter.value.map((item) => (item.id === itemId ? { ...item, name: newName } : item));
        updateParameter(updated);
    };

    const removeArrayItem = (itemId: string) => {
        if (!isArrayValue(parameter.value)) return;

        const updated = parameter.value.filter((item) => item.id !== itemId);
        updateParameter(updated);
    };

    return {
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
    };
};
