import { Position, Node } from '@/canvas/canvas.types';

export function moveNodes(
    nodes: Node[],
    selectedNodeIds: string[],
    initialNodePositions: Map<string, Position>,
    dragDelta: Position,
    nodeMoveStep: number,
): Node[] {
    const { x: dx, y: dy } = dragDelta;

    return nodes.map((node) => {
        if (!selectedNodeIds.includes(node.id)) return node;

        const initialPos = initialNodePositions.get(node.id);
        if (!initialPos) return node;

        return {
            ...node,
            position: {
                x: Math.round((initialPos.x + dx) / nodeMoveStep) * nodeMoveStep,
                y: Math.round((initialPos.y + dy) / nodeMoveStep) * nodeMoveStep,
            },
        };
    });
}
