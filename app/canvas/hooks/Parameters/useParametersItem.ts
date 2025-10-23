import { useParametersStore } from '@/canvas/store/parametersStore';
import { VariableValue, Enum } from '@/canvas/canvas.types';

const NUMBER_LIMITS = {
    MIN: -999999999,
    MAX: 999999999,
};

export const useParametersItem = (variableId: string) => {
    const { variables, setVariables } = useParametersStore();

    const variable = variables.find((v) => v.id === variableId);

    if (!variable) {
        throw new Error(`Variable with id ${variableId} not found`);
    }

    const updateVariable = (value: VariableValue) => {
        setVariables(variables.map((v) => (v.id === variableId ? { ...v, value } : v)));
    };

    const updateVariableName = (newName: string) => {
        setVariables(variables.map((v) => (v.id === variableId ? { ...v, name: newName } : v)));
    };

    const handleNumberInput = (value: string) => {
        if (variable.type !== 'number') return;

        if (value === '' || value === '-' || value === '-.') {
            updateVariable(0);
            return;
        }

        if (!/^-?\d*\.?\d*$/.test(value)) {
            return;
        }

        if (value.endsWith('.') || value === '-.' || (value.startsWith('-') && value.endsWith('.'))) {
            updateVariable(0);
            return;
        }

        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            updateVariable(0);
            return;
        }

        if (numValue < NUMBER_LIMITS.MIN) {
            updateVariable(NUMBER_LIMITS.MIN);
        }

        if (numValue > NUMBER_LIMITS.MAX) {
            updateVariable(NUMBER_LIMITS.MAX);
        }

        if (numValue >= NUMBER_LIMITS.MIN && numValue <= NUMBER_LIMITS.MAX) {
            updateVariable(numValue);
        }
    };

    const getDisplayValue = (): string => {
        if (variable.type !== 'number') return String(variable.value);
        return variable.value.toString();
    };

    const updateEnumOption = (index: number, newValue: string) => {
        if (variable.type !== 'enum') return;

        const newEnum = [...(variable.value as Enum)];
        newEnum[index] = newValue;
        updateVariable(newEnum);
    };

    const addEnumOption = () => {
        if (variable.type !== 'enum') return;
        updateVariable([...(variable.value as Enum), '']);
    };

    const removeEnumOption = (index: number) => {
        if (variable.type !== 'enum') return;
        const newEnum = (variable.value as Enum).filter((_, i) => i !== index);
        updateVariable(newEnum);
    };

    return {
        variable,
        updateVariable,
        updateVariableName,
        updateEnumOption,
        addEnumOption,
        removeEnumOption,
        handleNumberInput,
        getDisplayValue,
    };
};
