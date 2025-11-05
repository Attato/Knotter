import { useParametersStore } from '@/canvas/store/parametersStore';
import { ParameterValue, Enum, ArrayItem } from '@/canvas/canvas.types';

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

        if (value === '' || value === '-' || value === '-.') {
            updateParameter(0);
            return;
        }

        if (!/^-?\d*\.?\d*$/.test(value)) {
            return;
        }

        if (value.endsWith('.') || value === '-.' || (value.startsWith('-') && value.endsWith('.'))) {
            updateParameter(0);
            return;
        }

        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            updateParameter(0);
            return;
        }

        if (numValue < NUMBER_LIMITS.MIN) {
            updateParameter(NUMBER_LIMITS.MIN);
        }

        if (numValue > NUMBER_LIMITS.MAX) {
            updateParameter(NUMBER_LIMITS.MAX);
        }

        if (numValue >= NUMBER_LIMITS.MIN && numValue <= NUMBER_LIMITS.MAX) {
            updateParameter(numValue);
        }
    };

    const getDisplayValue = (): string => {
        const { value } = parameter;

        if (isNumberValue(value)) {
            return value.toString();
        }

        if (isEnumValue(value)) {
            return value.selectedId || 'Не выбрано';
        }

        return String(value);
    };

    const updateEnumOption = (index: number, newValue: string) => {
        if (!isEnumValue(parameter.value)) return;

        const newOptions: Enum = {
            ...parameter.value,
            options: {
                ...parameter.value.options,
                values: parameter.value.options.values.map((value, i) => (i === index ? newValue : value)),
            },
        };
        updateParameter(newOptions);
    };

    const addEnumOption = () => {
        if (!isEnumValue(parameter.value)) return;

        const newOptions: Enum = {
            ...parameter.value,
            options: {
                ...parameter.value.options,
                values: [...parameter.value.options.values, ''],
            },
        };
        updateParameter(newOptions);
    };

    const removeEnumOption = (index: number) => {
        if (!isEnumValue(parameter.value)) return;

        const newValues = parameter.value.options.values.filter((_, i) => i !== index);
        const removedValue = parameter.value.options.values[index];
        const newSelectedId = parameter.value.selectedId === removedValue ? null : parameter.value.selectedId;

        const newOptions: Enum = {
            ...parameter.value,
            options: {
                ...parameter.value.options,
                values: newValues,
            },
            selectedId: newSelectedId,
        };
        updateParameter(newOptions);
    };

    const addArrayItem = (item: ArrayItem) => {
        if (!isArrayValue(parameter.value)) return;
        updateParameter([...parameter.value, item]);
    };

    const updateArrayItem = (itemId: string, updates: Partial<ArrayItem>) => {
        if (!isArrayValue(parameter.value)) return;
        const newArray = parameter.value.map((item) => (item.id === itemId ? { ...item, ...updates } : item));
        updateParameter(newArray);
    };

    const removeArrayItem = (itemId: string) => {
        if (!isArrayValue(parameter.value)) return;
        const newArray = parameter.value.filter((item) => item.id !== itemId);
        updateParameter(newArray);
    };

    const parameterType = getParameterType();

    return {
        parameter,
        parameterType,
        updateParameter,
        updateParameterName,
        updateEnumOption,
        addEnumOption,
        removeEnumOption,
        addArrayItem,
        updateArrayItem,
        removeArrayItem,
        handleNumberInput,
        getDisplayValue,
    };
};
