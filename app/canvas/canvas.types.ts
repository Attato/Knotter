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
    shapeType: NodeShapeType;
    position: Position;
    kind: 'node';
}

export interface Edge {
    id: string;
    name: string;
    from: string;
    to: string;
    position: Position;
    kind: 'edge';
}
