import { ParameterValue, NumberConfig, SelectableOptions, Parameter } from '@/canvas/parameter.types';

export const isNumberValue = (value: ParameterValue): value is { type: 'number'; data: NumberConfig } => {
    return value.type === 'number';
};

export const isStringValue = (value: ParameterValue): value is { type: 'string'; data: string } => {
    return value.type === 'string';
};

export const isBooleanValue = (value: ParameterValue): value is { type: 'boolean'; data: boolean } => {
    return value.type === 'boolean';
};

export const isSelectionValue = (value: ParameterValue): value is { type: 'selection'; data: SelectableOptions } => {
    return value.type === 'selection';
};

export const isGroupValue = (value: ParameterValue): value is { type: 'group'; data: Parameter[] } => {
    return value.type === 'group';
};
