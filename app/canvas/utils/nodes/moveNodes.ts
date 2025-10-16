import { Position, Node } from '@/canvas/canvas.types';

export function moveNodes(
    nodes: Node[],
    selectedNodeIds: string[],
    initialNodePositions: Map<string, Position>,
    dragDelta: Position,
    nodeMoveStep: number,
): Node[] {
    const { x: dx, y: dy } = dragDelta;

    let changed = false;

    const updatedNodes = nodes.map((node) => {
        if (!selectedNodeIds.includes(node.id)) return node;

        const initialPos = initialNodePositions.get(node.id);

        if (!initialPos) return node;

        const newX = Math.round((initialPos.x + dx) / nodeMoveStep) * nodeMoveStep;
        const newY = Math.round((initialPos.y + dy) / nodeMoveStep) * nodeMoveStep;

        if (newX === node.position.x && newY === node.position.y) {
            return node;
        }

        changed = true;

        return {
            ...node,
            position: { x: newX, y: newY },
        };
    });

    return changed ? updatedNodes : nodes;
}
