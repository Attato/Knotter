import { CanvasItem, Node } from '@/canvas/canvas.types';

export const getNodes = (items: CanvasItem[]): Node[] => items.filter((i): i is Node => i.kind === 'node');
