import { Node } from '@/canvas/canvas.types';
import {
    drawOctagon,
    drawCircle,
    drawDiamond,
    drawPoint,
    drawTriangle,
    drawHexagon,
    drawSquircle,
} from '@/canvas/utils/drawShapes';

export function drawNodes(ctx: CanvasRenderingContext2D, nodes: Node[], selectedNodeIds: string[], nodeSize: number) {
    const padding = 4;

    for (const node of nodes) {
        const isSelected = selectedNodeIds.includes(node.id);
        const { x, y } = node.position;

        ctx.save();

        switch (node.type) {
            case 'octagon':
                drawOctagon(ctx, x, y, nodeSize);
                break;

            case 'circle':
                drawCircle(ctx, x, y, nodeSize / 2);
                break;

            case 'diamond':
                drawDiamond(ctx, x, y, nodeSize);
                break;

            case 'triangle':
                drawTriangle(ctx, x, y, nodeSize);
                break;

            case 'hexagon':
                drawHexagon(ctx, x, y, nodeSize);
                break;

            case 'squircle':
                drawSquircle(ctx, x, y, nodeSize);
                break;

            case 'point':
                drawPoint(ctx, x, y, 3);
                break;
        }

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
