import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useParametersStore } from '@/canvas/store/parametersStore';

import { Enum, VariableType, VariableValue, Variable } from '@/canvas/canvas.types';

const VARIABLE_TYPES: { label: string; value: VariableType }[] = [
    { label: 'Число', value: 'number' },
    { label: 'Строка', value: 'string' },
    { label: 'Логическое выражение', value: 'boolean' },
    { label: 'Перечисление', value: 'enum' },
];

const NUMBER_LIMITS = {
    MIN: -999999999,
    MAX: 999999999,
    STEP: 1,
};

export const useParameters = () => {
    const { variables, setVariables } = useParametersStore();

    const [name, setName] = useState('');
    const [type, setType] = useState<VariableType>('number');

    const createInitialValue = (type: VariableType): VariableValue => {
        switch (type) {
            case 'number':
                return 0;
            case 'string':
                return '';
            case 'boolean':
                return false;
            case 'enum':
                return ['Первая опция'] as Enum;
        }
    };

    const addVariable = () => {
        if (!name) return;

        const newVar: Variable = {
            id: uuid(),
            name,
            type,
            value: createInitialValue(type),
        };

        setVariables([...variables, newVar]);
        setName('');
    };

    const updateVariable = (id: string, value: VariableValue) => {
        setVariables(variables.map((v) => (v.id === id ? { ...v, value } : v)));
    };

    const updateVariableName = (id: string, newName: string) => {
        setVariables(variables.map((v) => (v.id === id ? { ...v, name: newName } : v)));
    };

    const modifyEnum = (varId: string, modifier: (arr: Enum) => Enum) => {
        setVariables(
            variables.map((v) => (v.id === varId && v.type === 'enum' ? { ...v, value: modifier(v.value as Enum) } : v)),
        );
    };

    const updateEnumOption = (varId: string, index: number, newValue: string) =>
        modifyEnum(varId, (arr) => {
            const copy = [...arr];
            copy[index] = newValue;
            return copy;
        });

    const addEnumOption = (variableId: string) => modifyEnum(variableId, (arr) => [...arr, '']);
    const removeEnumOption = (variableId: string, index: number) =>
        modifyEnum(variableId, (arr) => arr.filter((_, i) => i !== index));

    const handleNumberInput = (value: string, variableId: string) => {
        if (value === '' || value === '-' || value === '-.') {
            updateVariable(variableId, 0);
            return;
        }

        if (!/^-?\d*\.?\d*$/.test(value)) {
            return;
        }

        if (value.endsWith('.') || value === '-.' || (value.startsWith('-') && value.endsWith('.'))) {
            updateVariable(variableId, 0);
            return;
        }

        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            updateVariable(variableId, 0);
            return;
        }

        if (numValue < NUMBER_LIMITS.MIN) {
            updateVariable(variableId, NUMBER_LIMITS.MIN);
        }

        if (numValue > NUMBER_LIMITS.MAX) {
            updateVariable(variableId, NUMBER_LIMITS.MAX);
        }

        if (numValue >= NUMBER_LIMITS.MIN && numValue <= NUMBER_LIMITS.MAX) {
            updateVariable(variableId, numValue);
        }
    };

    const getDisplayValue = (variable: Variable): string => {
        if (variable.type !== 'number') return String(variable.value);
        return variable.value.toString();
    };

    const removeVariable = (id: string) => {
        setVariables(variables.filter((v) => v.id !== id));
    };

    return {
        name,
        type,
        variables,
        variableTypes: VARIABLE_TYPES,

        setName,
        setType,

        addVariable,
        updateVariable,
        updateVariableName,
        updateEnumOption,
        addEnumOption,
        removeEnumOption,
        handleNumberInput,
        getDisplayValue,
        removeVariable,
    };
};
