import { CanvasItem, Node } from '../../canvas.types';
import { getNodes } from './getNodes';

export const getSelectedNodes = (items: CanvasItem[], selectedIds: string[]): Node[] =>
    getNodes(items).filter((node) => selectedIds.includes(node.id));
