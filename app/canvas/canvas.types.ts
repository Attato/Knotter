export type Position = { x: number; y: number };

export interface CanvasState {
    nodes: Node[];
    edges: Edge[];
}

export interface Node {
    id: number;
    type: 'octagon';
    position: Position;
}

export interface Edge {
    id: number;
    from: number;
    to: number;
}
