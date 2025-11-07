import { useParametersStore } from '@/canvas/store/parametersStore';
import { ParameterValue, Enum, ArrayItem, ParameterType } from '@/canvas/canvas.types';
import { v4 as uuid } from 'uuid';

const NUMBER_LIMITS = {
    MIN: -999999999,
    MAX: 999999999,
};

const isObject = (value: unknown): value is object => value !== null && typeof value === 'object';
const hasSelectedId = (value: object): value is { selectedId: unknown } => 'selectedId' in value;
const isValidEnum = (value: unknown): value is Enum => isObject(value) && hasSelectedId(value);

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

    const getParameterType = (): ParameterType => {
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

    const getEnumOptionName = (index: number): string => {
        if (!isEnumValue(parameter.value)) return `Опция ${index + 1}`;

        return parameter.value.options[index]?.name || `Опция ${index + 1}`;
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

    const handleDropToArray = (droppedId: string) => {
        const droppedParam = parameters.find((p) => p.id === droppedId);

        if (!droppedParam) return;

        if (!isArrayValue(parameter.value)) return;

        if (droppedParam.type !== 'number' && droppedParam.type !== 'string' && droppedParam.type !== 'boolean') {
            return;
        }

        const newItem: ArrayItem = {
            id: uuid(),
            name: droppedParam.name,
            type: droppedParam.type,
            value: droppedParam.value as number | string | boolean,
        } as ArrayItem;

        const updatedArray = [...parameter.value, newItem];
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

    const convertArrayItemValue = (item: ArrayItem, newValue: string | number | boolean): ArrayItem => {
        switch (item.type) {
            case 'number':
                return {
                    ...item,
                    value: convertToNumber(newValue),
                };

            case 'boolean':
                return {
                    ...item,
                    value: convertToBoolean(newValue),
                };

            case 'string':
            default:
                return {
                    ...item,
                    value: convertToString(newValue),
                };
        }
    };

    const updateArrayItemValue = (itemId: string, newValue: string | number | boolean) => {
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
        removeEnumItem,
    };
};
