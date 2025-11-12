import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { ParameterType, Parameter } from '@/canvas/canvas.types';
import { createInitialParameterValue } from '@/canvas/utils/items/parameters.utils';

export const useParameters = () => {
    const parameters = useCanvasStore((state) => state.parameters);
    const setParameters = useCanvasStore((state) => state.setParameters);

    const [name, setName] = useState('');
    const [type, setType] = useState<ParameterType>('number');

    const addParameter = () => {
        if (!name) return;

        const newParameter: Parameter = {
            id: uuid(),
            name,
            type,
            value: createInitialParameterValue(type),
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

        setName,
        setType,
        addParameter,
        removeParameter,
    };
};
