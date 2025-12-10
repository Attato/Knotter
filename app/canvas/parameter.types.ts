export type ParameterType = 'number' | 'string' | 'boolean' | 'enum' | 'array';
export type ParameterValue = NumberConfig | string | boolean | Enum | ArrayItem[];

export interface Parameter {
    id: string;
    name: string;
    type: ParameterType;
    baseValue: ParameterValue;
    value: ParameterValue;
}

export type NumberConfig = {
    base: number;
    min: number;
    max: number;
    step?: number;
};

export type Enum = {
    options: Array<{
        id: string;
        name: string;
        value: string;
    }>;
    selectedId: string | null;
};

export type ArrayItem =
    | { id: string; name: string; type: 'number'; value: number }
    | { id: string; name: string; type: 'string'; value: string }
    | { id: string; name: string; type: 'boolean'; value: boolean }
    | { id: string; name: string; type: 'enum'; value: Enum };
