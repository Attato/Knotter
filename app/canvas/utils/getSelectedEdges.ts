import { CanvasItem, Edge } from '../canvas.types';
import { getEdges } from './getEdges';

export const getSelectedEdges = (items: CanvasItem[], selectedIds: string[]): Edge[] =>
    getEdges(items).filter((edge) => selectedIds.includes(edge.from) && selectedIds.includes(edge.to));
