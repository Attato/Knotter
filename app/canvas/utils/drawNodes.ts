import { Node } from '@/canvas/canvas.types';
import { drawOctagon } from '@/canvas/utils/drawOctagon';

export function drawNodes(ctx: CanvasRenderingContext2D, nodes: Node[], selectedNodeIds: string[], nodeSize: number) {
    const padding = 4;

    for (const node of nodes) {
        const isSelected = selectedNodeIds.includes(node.id);
        const { x, y } = node.position;

        ctx.save();
        ctx.beginPath();
        drawOctagon(ctx, x, y, nodeSize);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.restore();

        if (isSelected) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(x - nodeSize / 2 - padding, y - nodeSize / 2 - padding, nodeSize + 2 * padding, nodeSize + 2 * padding);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffc107';
            ctx.stroke();
            ctx.restore();
        }
    }
}
