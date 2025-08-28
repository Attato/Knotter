export type Position = { x: number; y: number };

export interface CanvasState {
    nodes: Node[];
    edges: Edge[];
}

export interface Node {
    id: string;
    name: string;
    type: 'octagon';
    position: Position;
}

export interface Edge {
    id: string;
    from: string;
    to: string;
}
