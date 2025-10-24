export type MouseHandler = (e: MouseEvent) => void;

export type Position = { x: number; y: number };

export interface CanvasState {
    nodes: Node[];
    edges: Edge[];
}

export type CanvasItem = Node | Edge;

export type NodeShapeType = 'octagon' | 'circle' | 'diamond' | 'triangle' | 'hexagon' | 'squircle' | 'point';

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
    properties: Property[];
}

export interface Edge {
    id: string;
    name: string;
    description: string;
    from: string;
    to: string;
    position: Position;
    kind: 'edge';
    properties: Property[];
}

export type Enum = string[];
export type ParameterType = 'number' | 'string' | 'boolean' | 'enum';
export type ParameterValue = number | string | boolean | Enum;

export interface Parameter {
    id: string;
    name: string;
    type: ParameterType;
    value: ParameterValue;
}

export interface Property {
    id: string;
    name: string;
    parameters: Parameter[];
}
