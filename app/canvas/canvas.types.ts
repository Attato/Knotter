export type Position = { x: number; y: number };

export interface CanvasState {
    nodes: Node[];
    edges: Edge[];
}

export type CanvasItem = Node | Edge;

export interface Node {
    id: string;
    name: string;
    type: 'octagon';
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
