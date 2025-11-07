import { useParametersStore } from '@/canvas/store/parametersStore';
import { ParameterValue, Enum, ArrayItem } from '@/canvas/canvas.types';
import { v4 as uuid } from 'uuid';

const NUMBER_LIMITS = {
    MIN: -999999999,
    MAX: 999999999,
};

const isObject = (value: unknown): value is object => value !== null && typeof value === 'object';
const hasOptions = (value: object): value is { options: unknown } => 'options' in value;
const hasSelectedId = (value: object): value is { selectedId: unknown } => 'selectedId' in value;
const isValidEnum = (value: unknown): value is Enum => isObject(value) && hasOptions(value) && hasSelectedId(value);

export const isNumberValue = (value: ParameterValue): value is number => typeof value === 'number';
export const isStringValue = (value: ParameterValue): value is string => typeof value === 'string';
export const isBooleanValue = (value: ParameterValue): value is boolean => typeof value === 'boolean';
export const isEnumValue = (value: ParameterValue): value is Enum => isValidEnum(value);
export const isArrayValue = (value: ParameterValue): value is ArrayItem[] => Array.isArray(value);

export const useParametersItem = (parameterId: string) => {
    const parameters = useParametersStore((state) => state.parameters);
    const setParameters = useParametersStore((state) => state.setParameters);

    const parameter = parameters.find((parameter) => parameter.id === parameterId);

    if (!parameter) {
        throw new Error(`Variable with id ${parameterId} not found`);
    }

    const updateParameter = (value: ParameterValue) => {
        setParameters(parameters.map((parameter) => (parameter.id === parameterId ? { ...parameter, value } : parameter)));
    };

    const updateParameterName = (newName: string) => {
        setParameters(
            parameters.map((parameter) => (parameter.id === parameterId ? { ...parameter, name: newName } : parameter)),
        );
    };

    const getParameterType = (): 'number' | 'string' | 'boolean' | 'enum' | 'array' => {
        const { value } = parameter;

        if (isNumberValue(value)) return 'number';
        if (isStringValue(value)) return 'string';
        if (isBooleanValue(value)) return 'boolean';
        if (isArrayValue(value)) return 'array';
        if (isEnumValue(value)) return 'enum';

        return 'string';
    };

    const handleNumberInput = (value: string) => {
        if (!isNumberValue(parameter.value)) return;
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= NUMBER_LIMITS.MIN && numValue <= NUMBER_LIMITS.MAX) {
            updateParameter(numValue);
        }
    };

    const getDisplayValue = (): string => {
        const { value } = parameter;

        if (isNumberValue(value)) {
            return value.toString();
        }

        if (isEnumValue(value)) {
            const selectedOption = value.options.values.find((opt) => opt.id === value.selectedId);
            return selectedOption?.name || selectedOption?.value || 'Не выбрано';
        }
        return String(value);
    };

    const updateEnumOption = (itemId: string, newValue: string) => {
        if (!isEnumValue(parameter.value)) return;

        const updated: Enum = {
            ...parameter.value,
            options: {
                ...parameter.value.options,
                values: parameter.value.options.values.map((item) =>
                    item.id === itemId ? { ...item, value: newValue } : item,
                ),
            },
        };
        updateParameter(updated);
    };

    const updateEnumOptionName = (index: number, newName: string) => {
        if (!isEnumValue(parameter.value)) return;
        const updated: Enum = {
            ...parameter.value,
            options: {
                ...parameter.value.options,
                values: parameter.value.options.values.map((o, i) => (i === index ? { ...o, name: newName } : o)),
            },
        };
        updateParameter(updated);
    };

    const getEnumOptionName = (index: number): string => {
        if (!isEnumValue(parameter.value)) return `Опция ${index + 1}`;

        return parameter.value.options.values[index]?.name || `Опция ${index + 1}`;
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
            options: {
                ...parameter.value.options,
                values: [...parameter.value.options.values, newOption],
            },
        };

        const filtered = parameters.filter((p) => p.id !== droppedId);

        setParameters(filtered.map((p) => (p.id === parameter.id ? { ...parameter, value: updatedEnum } : p)));
    };

    const handleDropToArray = (droppedId: string) => {
        const droppedParam = parameters.find((p) => p.id === droppedId);

        if (!droppedParam) return;

        if (!isArrayValue(parameter.value)) return;

        const newItem: ArrayItem = {
            id: uuid(),
            name: droppedParam.name,
            value: droppedParam.value as string | number | boolean,
        };

        const updatedArray = [...parameter.value, newItem];
        const filtered = parameters.filter((p) => p.id !== droppedId);

        setParameters(filtered.map((p) => (p.id === parameter.id ? { ...parameter, value: updatedArray } : p)));
    };

    const parameterType = getParameterType();

    const updateArrayItemValue = (itemId: string, newValue: string | number | boolean) => {
        if (!isArrayValue(parameter.value)) return;

        const updated = parameter.value.map((item) => (item.id === itemId ? { ...item, value: newValue } : item));
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
        updateEnumOption,
        updateEnumOptionName,
        getEnumOptionName,
        handleNumberInput,
        getDisplayValue,
        handleDropToEnum,
        handleDropToArray,
        updateArrayItemValue,
        updateArrayItemName,
        removeArrayItem,
    };
};
