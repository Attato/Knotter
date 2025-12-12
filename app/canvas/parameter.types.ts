export type ParameterType = 'number' | 'string' | 'boolean' | 'selection' | 'group';

export type ParameterValue = {
    type: ParameterType;
    data: NumberConfig | string | boolean | SelectableOptions | Parameter[];
};

export interface Parameter {
    id: string;
    name: string;
    type: ParameterType;
    baseValue: ParameterValue;
    currentValue: ParameterValue;
}

export type NumberConfig = {
    baseValue: number;
    min: number;
    max: number;
    step?: number;
};

export type SelectableOption = {
    id: string;
    name: string;
    value: string;
};

export type SelectableOptions = {
    options: SelectableOption[];
    selectedId: string | null;
};
