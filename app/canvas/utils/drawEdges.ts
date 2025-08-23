import { Node, Edge } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';

export function drawEdges(ctx: CanvasRenderingContext2D, nodes: Node[], edges: Edge[]) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;

    for (const edge of edges) {
        const fromNode = nodes.find((n) => n.id === edge.from);
        const toNode = nodes.find((n) => n.id === edge.to);

        if (!fromNode || !toNode) continue;

        const fromX = fromNode.position.x + NODE_SIZE / 2;
        const fromY = fromNode.position.y + NODE_SIZE / 2;
        const toX = toNode.position.x + NODE_SIZE / 2;
        const toY = toNode.position.y + NODE_SIZE / 2;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }
}
