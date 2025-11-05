import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useParametersStore } from '@/canvas/store/parametersStore';

import { ParameterType, ParameterValue, Parameter } from '@/canvas/canvas.types';

const PARAMETER_TYPES: { label: string; value: ParameterType }[] = [
    { label: 'Число', value: 'number' },
    { label: 'Строка', value: 'string' },
    { label: 'Флаг', value: 'boolean' },
    { label: 'Список', value: 'enum' },
    { label: 'Массив', value: 'array' },
];

export const useParameters = () => {
    const { parameters, setParameters } = useParametersStore();
    const [name, setName] = useState('');
    const [type, setType] = useState<ParameterType>('number');

    const createInitialValue = (type: ParameterType): ParameterValue => {
        const initialEnumValue = {
            options: {
                id: uuid(),
                values: [''],
            },
            selectedId: null,
        };

        switch (type) {
            case 'number':
                return 0;
            case 'string':
                return '';
            case 'boolean':
                return false;
            case 'enum':
                return initialEnumValue;
            case 'array':
                return [];
        }
    };

    const addParameter = () => {
        if (!name) return;

        const newParameter: Parameter = {
            id: uuid(),
            name,
            type,
            value: createInitialValue(type),
        };

        setParameters([...parameters, newParameter]);
        setName('');
    };

    const removeParameter = (id: string) => {
        setParameters(parameters.filter((p) => p.id !== id));
    };

    return {
        name,
        type,
        parameters,
        parameterTypes: PARAMETER_TYPES,

        setName,
        setType,
        addParameter,
        removeParameter,
    };
};
