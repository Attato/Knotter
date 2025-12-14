export type ParameterType = 'number' | 'string' | 'boolean' | 'enum' | 'array';
export type ParameterData = NumberConfig | string | boolean | EnumConfig | Parameter[];

export interface Parameter {
    id: string;
    name: string;
    type: ParameterType;
    data: ParameterData;
}

export type NumberConfig = {
    currentValue: number;
    min: number;
    max: number;
    step: number;
};

export type EnumConfig = {
    options: EnumOption[];
};

export type EnumOption = {
    id: string;
    name: string;
    value: string;
};
