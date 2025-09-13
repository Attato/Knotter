import { Node, Edge } from '../canvas.types';
import { handleAddEdge } from './handleAddEdge';

export const cloneEdgesForNewNodes = (edges: Edge[], newNodes: Node[], nodeIdMap: Map<string, string>): Edge[] =>
    edges.flatMap((edge) => {
        const fromNode = newNodes.find((n) => n.id === nodeIdMap.get(edge.from));
        const toNode = newNodes.find((n) => n.id === nodeIdMap.get(edge.to));
        if (!fromNode || !toNode) return [];
        return handleAddEdge([], fromNode, toNode);
    });
