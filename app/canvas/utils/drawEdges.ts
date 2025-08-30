import { Node, Edge } from '@/canvas/canvas.types';

export function drawEdges(ctx: CanvasRenderingContext2D, nodes: Node[], edges: Edge[]) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;

    for (const edge of edges) {
        const fromNode = nodes.find((n) => n.id === edge.from);
        const toNode = nodes.find((n) => n.id === edge.to);

        if (!fromNode || !toNode) continue;

        const fromX = fromNode.position.x;
        const fromY = fromNode.position.y;
        const toX = toNode.position.x;
        const toY = toNode.position.y;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }
}
