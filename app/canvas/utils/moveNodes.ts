import { Position } from '@/canvas/canvas.types';
import { Node } from '@/canvas/canvas.types';

export function moveNodes(
    nodes: Node[],
    selectedNodeIds: string[],
    initialNodePositions: Map<string, Position>,
    dragDelta: Position,
    nodeMoveStep: number,
): Node[] {
    const { x: dx, y: dy } = dragDelta;

    return nodes.map((node) => {
        if (selectedNodeIds.includes(node.id)) {
            const initialPos = initialNodePositions.get(node.id);
            if (!initialPos) return node;

            const newX = initialPos.x + dx;
            const newY = initialPos.y + dy;

            return {
                ...node,
                position: {
                    x: Math.round(newX / nodeMoveStep) * nodeMoveStep,
                    y: Math.round(newY / nodeMoveStep) * nodeMoveStep,
                },
            };
        }
        return node;
    });
}
