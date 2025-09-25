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

    const rootStyles = getComputedStyle(document.documentElement);
    const strokeColor = rootStyles.getPropertyValue('--contrast').trim();
    const selectedStrokeColor = rootStyles.getPropertyValue('--selected').trim();
    const fillColor = rootStyles.getPropertyValue('--background').trim();

    for (const node of nodes) {
        const isSelected = selectedNodeIds.includes(node.id);
        const { x, y } = node.position;

        const options = { fillStyle: fillColor, strokeStyle: strokeColor, lineWidth: 2 };

        switch (node.shapeType) {
            case 'octagon':
                drawOctagon(ctx, x, y, nodeSize, options);
                break;
            case 'circle':
                drawCircle(ctx, x, y, nodeSize / 2, options);
                break;
            case 'diamond':
                drawDiamond(ctx, x, y, nodeSize, options);
                break;
            case 'triangle':
                drawTriangle(ctx, x, y, nodeSize, options);
                break;
            case 'hexagon':
                drawHexagon(ctx, x, y, nodeSize, options);
                break;
            case 'squircle':
                drawSquircle(ctx, x, y, nodeSize, options);
                break;
            case 'point':
                drawPoint(ctx, x, y, 3, options);
                break;
        }

        if (isSelected) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(x - nodeSize / 2 - padding, y - nodeSize / 2 - padding, nodeSize + 2 * padding, nodeSize + 2 * padding);
            ctx.lineWidth = 2;
            ctx.strokeStyle = selectedStrokeColor;
            ctx.stroke();
            ctx.restore();
        }
    }
}
