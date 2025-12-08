import { NodeShapeType } from '@/canvas/utils/nodes/getShape';

export type MouseHandler = (e: MouseEvent) => void;

export type Position = { x: number; y: number };

export interface CanvasState {
    nodes: Node[];
    edges: Edge[];
}

export type EditorMode = 'edit' | 'view';

export type CanvasItem = Node | Edge;

export type TooltipMode = 'always' | 'hover' | 'never';

export interface DrawOptions {
    fillStyle?: string;
    strokeStyle?: string;
    lineWidth?: number;
    cornerRadius?: number;
}

export interface Node {
    id: string;
    name: string;
    description: string;
    shapeType: NodeShapeType;
    width?: number;
    height?: number;
    position: Position;
    kind: 'node';
    properties: PropertyType[];
}

export interface Edge {
    id: string;
    name: string;
    description: string;
    from: string;
    to: string;
    position: Position;
    kind: 'edge';
    properties: PropertyType[];
}

export type ParameterType = 'number' | 'string' | 'boolean' | 'enum' | 'array';

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

export type NumberConfig = {
    base: number;
    min: number;
    max: number;
    step?: number;
};

export type ParameterValue = NumberConfig | string | boolean | Enum | ArrayItem[];

export interface Parameter {
    id: string;
    name: string;
    type: ParameterType;
    value: ParameterValue;
}

export interface PropertyType extends Parameter {
    parentId: string;
}
