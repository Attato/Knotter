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
}

export interface Edge {
    id: string;
    name: string;
    description: string;
    from: string;
    to: string;
    position: Position;
    kind: 'edge';
}

export type Enum = string[];
export type VariableType = 'number' | 'string' | 'boolean' | 'enum';
export type VariableValue = number | string | boolean | Enum;

export interface Variable {
    id: string;
    name: string;
    type: VariableType;
    value: VariableValue;
}
