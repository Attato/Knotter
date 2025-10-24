import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useParametersStore } from '@/canvas/store/parametersStore';

import { Enum, ParameterType, ParameterValue, Parameter } from '@/canvas/canvas.types';

const PARAMETER_TYPES: { label: string; value: ParameterType }[] = [
    { label: 'Число', value: 'number' },
    { label: 'Строка', value: 'string' },
    { label: 'Логическое выражение', value: 'boolean' },
    { label: 'Перечисление', value: 'enum' },
];

export const useParameters = () => {
    const { parameters, setParameters } = useParametersStore();
    const [name, setName] = useState('');
    const [type, setType] = useState<ParameterType>('number');

    const createInitialValue = (type: ParameterType): ParameterValue => {
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
