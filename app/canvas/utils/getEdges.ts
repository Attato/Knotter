import { CanvasItem, Edge } from '@/canvas/canvas.types';

export const getEdges = (items: CanvasItem[]): Edge[] => items.filter((i): i is Edge => i.kind === 'edge');
