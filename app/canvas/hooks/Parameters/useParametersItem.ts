import { useParametersStore } from '@/canvas/store/parametersStore';
import { ParameterValue, Enum } from '@/canvas/canvas.types';

const NUMBER_LIMITS = {
    MIN: -999999999,
    MAX: 999999999,
};

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

    const handleNumberInput = (value: string) => {
        if (parameter.type !== 'number') return;

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
        if (parameter.type !== 'number') return String(parameter.value);
        return parameter.value.toString();
    };

    const updateEnumOption = (index: number, newValue: string) => {
        if (parameter.type !== 'enum') return;

        const newEnum = [...(parameter.value as Enum)];
        newEnum[index] = newValue;
        updateParameter(newEnum);
    };

    const addEnumOption = () => {
        if (parameter.type !== 'enum') return;
        updateParameter([...(parameter.value as Enum), '']);
    };

    const removeEnumOption = (index: number) => {
        if (parameter.type !== 'enum') return;
        const newEnum = (parameter.value as Enum).filter((_, i) => i !== index);
        updateParameter(newEnum);
    };

    return {
        parameter,
        updateParameter,
        updateParameterName,
        updateEnumOption,
        addEnumOption,
        removeEnumOption,
        handleNumberInput,
        getDisplayValue,
    };
};
