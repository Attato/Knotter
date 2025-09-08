import { Node, Position } from '@/canvas/canvas.types';

export function drawTempEdge(
    ctx: CanvasRenderingContext2D,
    nodes: Node[],
    tempEdge: { from: string; toPos: Position } | null,
) {
    if (!tempEdge) return;

    const fromNode = nodes.find((n) => n.id === tempEdge.from);
    if (!fromNode) return;

    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromNode.position.x, fromNode.position.y);
    ctx.lineTo(tempEdge.toPos.x, tempEdge.toPos.y);
    ctx.stroke();
}
