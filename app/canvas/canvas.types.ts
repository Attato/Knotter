export type Point = { x: number; y: number };

export interface Node {
    id: number;
    type: 'octagon';
    position: Point;
}

export interface Edge {
    id: number;
    from: number;
    to: number;
}
