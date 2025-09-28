import { NodeShapeType } from '@/canvas/canvas.types';

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 10;
export const INITIAL_ZOOM = 1;

export const DRAG_THRESHOLD = 3;

export const MAX_UNDO_STEPS = 50;

export const NODE_SIZE = 40;
export const NODE_MOVE_MIN_STEP = 1;
export const NODE_MOVE_MAX_STEP = 50;

export const MAX_CANVAS_ITEMS = 250;

export const NODE_SHAPE_TYPES: NodeShapeType[] = [
    'point',
    'circle',
    'squircle',
    'triangle',
    'diamond',
    'hexagon',
    'octagon',
];
