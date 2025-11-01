export type MouseHandler = (e: MouseEvent) => void;

export type Position = { x: number; y: number };

export interface CanvasState {
    nodes: Node[];
    edges: Edge[];
}

export type CanvasItem = Node | Edge;

export type NodeShapeType = 'octagon' | 'circle' | 'diamond' | 'triangle' | 'hexagon' | 'squircle' | 'point';

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

export type PrimitiveType = 'number' | 'string' | 'boolean';
export type ParameterType = PrimitiveType | 'array';

export interface ArrayItem {
    id: string;
    name: string;
    type: PrimitiveType;
    value: number | string | boolean;
}

export type ParameterValue = number | string | boolean | ArrayItem[];

export interface Parameter {
    id: string;
    name: string;
    type: ParameterType;
    value: ParameterValue;
}

export interface PropertyType extends Parameter {
    parentId: string;
}
