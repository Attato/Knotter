import { v4 as uuid } from 'uuid';
import { ParameterType, ParameterValue, Enum } from '@/canvas/canvas.types';

export const getTypeLabel = (type: string): string => {
    switch (type) {
        case 'number':
            return 'Число';
        case 'string':
            return 'Текст';
        case 'boolean':
            return 'Флаг';
        case 'enum':
            return 'Список';
        case 'array':
            return 'Массив';
        default:
            return type;
    }
};

export const PARAMETER_TYPES: { label: string; value: ParameterType }[] = [
    { value: 'number', label: getTypeLabel('number') },
    { value: 'string', label: getTypeLabel('string') },
    { value: 'boolean', label: getTypeLabel('boolean') },
    { value: 'enum', label: getTypeLabel('enum') },
    { value: 'array', label: getTypeLabel('array') },
];

export const EMPTY_ENUM: Enum = {
    options: { id: uuid(), values: [] },
    selectedId: null,
};

export const createInitialParameterValue = (type: ParameterType): ParameterValue => {
    switch (type) {
        case 'number':
            return 0;
        case 'string':
            return '';
        case 'boolean':
            return false;
        case 'enum':
            return EMPTY_ENUM;
        case 'array':
            return [];
    }
};
