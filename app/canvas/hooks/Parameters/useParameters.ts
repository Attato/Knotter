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
        removeVariable,
    };
};
