import { Node, Edge, CanvasState } from '@/canvas/canvas.types';

export function handleDeleteNode(nodes: Node[], edges: Edge[], selectedNodeIds: number[]): CanvasState {
    const newNodes = nodes.filter((node) => !selectedNodeIds.includes(node.id));
    const newEdges = edges.filter((edge) => !selectedNodeIds.includes(edge.from) && !selectedNodeIds.includes(edge.to));

    return { nodes: newNodes, edges: newEdges };
}
