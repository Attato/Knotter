import { Node } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import {
    drawOctagon,
    drawCircle,
    drawDiamond,
    drawPoint,
    drawTriangle,
    drawHexagon,
    drawSquircle,
} from '@/canvas/utils/nodes/drawShapes';

interface DrawNodesProps {
    ctx: CanvasRenderingContext2D;
    nodes: Node[];
    selectedNodeIds: string[];
    nodeSize: number;
    invertY: boolean;
    zoomLevel: number;
    offset: { x: number; y: number };
    hoveredNodeId?: string | null;
}

interface DrawTooltipProps {
    ctx: CanvasRenderingContext2D;
    text: string;
    nodeX: number;
    nodeY: number;
    nodeSize: number;
    textColor: string;
    backgroundColor: string;
    invertY: boolean;
}

function getNodeColor(nodeId: string): string {
    let hash = 0;

    for (let i = 0; i < nodeId.length; i++) {
        hash = nodeId.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = ((hash & 0xff) % 100) + 50; // 50-150
    const g = (((hash >> 8) & 0xff) % 100) + 50; // 50-150
    const b = (((hash >> 16) & 0xff) % 100) + 50; // 50-150

    return `rgb(${r}, ${g}, ${b})`;
}

function drawEditModeNode(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, node: Node) {
    const lineWidth = 1;
    const headerHeight = 32;
    const padding = 12;
    const borderRadius = 4;
    const minWidth = size * 5;
    const headerPaddingX = 0.5;
    const headerPaddingY = 0.5;
    const rootStyles = getComputedStyle(document.documentElement);

    ctx.save();

    ctx.font = '14px Inter, system-ui, sans-serif';
    const textWidth = ctx.measureText(node.name).width;
    const nodeWidth = Math.max(minWidth, textWidth + padding * 2);
    const nodeHeight = size * 3;

    ctx.translate(x - nodeWidth / 2, y - nodeHeight / 2);

    ctx.beginPath();
    ctx.roundRect(0, 0, nodeWidth, nodeHeight, borderRadius);
    ctx.fillStyle = rootStyles.getPropertyValue('--card-bg');
    ctx.fill();
    ctx.strokeStyle = rootStyles.getPropertyValue('--border-light').trim();
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    ctx.beginPath();

    ctx.roundRect(headerPaddingX, headerPaddingY, nodeWidth - headerPaddingX * 2, headerHeight - headerPaddingY, [
        borderRadius - 0.5,
        borderRadius - 0.5,
        0,
        0,
    ]);

    const headerColor = getNodeColor(node.id);
    ctx.fillStyle = headerColor;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.name, headerPaddingX + 8, headerHeight / 2);

    ctx.restore();
}

export function drawNodes({
    ctx,
    nodes,
    selectedNodeIds,
    nodeSize,
    invertY = false,
    zoomLevel = 1,
    hoveredNodeId = null,
}: DrawNodesProps) {
    const padding = 4;

    const rootStyles = getComputedStyle(document.documentElement);
    const strokeColor = rootStyles.getPropertyValue('--contrast').trim();
    const selectedStrokeColor = rootStyles.getPropertyValue('--selected').trim();
    const fillColor = rootStyles.getPropertyValue('--background').trim();
    const textColor = rootStyles.getPropertyValue('--foreground').trim();

    const tooltipMode = useCanvasStore.getState().tooltipMode;
    const editorMode = useCanvasStore.getState().editorMode;

    const isEditMode = editorMode === 'edit';

    for (const node of nodes) {
        const isSelected = selectedNodeIds.includes(node.id);
        const isHovered = hoveredNodeId === node.id;
        const { x, y } = node.position;

        const options = { fillStyle: fillColor, strokeStyle: strokeColor, lineWidth: 2 };

        if (isEditMode) {
            drawEditModeNode(ctx, x, y, nodeSize, node);
        } else {
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
                    drawPoint(ctx, x, y, 1, options);
                    break;
            }
        }

        if (isSelected) {
            ctx.save();

            if (isEditMode) {
                const width = nodeSize * 2.5;
                const height = nodeSize * 3;
                ctx.beginPath();
                ctx.rect(x - width / 2 - padding, y - height / 2 - padding, width + 2 * padding, height + 2 * padding);
            } else {
                ctx.beginPath();
                ctx.rect(
                    x - nodeSize / 2 - padding,
                    y - nodeSize / 2 - padding,
                    nodeSize + 2 * padding,
                    nodeSize + 2 * padding,
                );
            }

            ctx.lineWidth = 2;
            ctx.strokeStyle = selectedStrokeColor;
            ctx.stroke();
            ctx.restore();
        }

        const shouldShowTooltip =
            node.name &&
            zoomLevel > 0.3 &&
            (tooltipMode === 'always' || (tooltipMode === 'hover' && isHovered)) &&
            !isEditMode;

        if (shouldShowTooltip) {
            drawTooltip({
                ctx,
                text: node.name,
                nodeX: x,
                nodeY: y,
                nodeSize,
                textColor,
                backgroundColor: fillColor,
                invertY,
            });
        }
    }
}

function drawTooltip({ ctx, text, nodeX, nodeY, nodeSize, textColor, backgroundColor, invertY = false }: DrawTooltipProps) {
    ctx.save();

    const fixedHeight = 24;
    const fontSize = 14;
    const padding = 6;
    const tooltipOffset = 8;

    ctx.font = `${fontSize}px Inter, system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let displayText = text;

    const textWidth = ctx.measureText(text).width;
    const tooltipWidth = Math.max(textWidth + padding * 2, 60);

    const maxTextWidth = tooltipWidth - padding * 2;

    if (textWidth > maxTextWidth) {
        let truncated = text;
        while (truncated.length > 3 && ctx.measureText(truncated + '...').width > maxTextWidth) {
            truncated = truncated.slice(0, -1);
        }
        displayText = truncated + '...';
    }

    const tooltipX = nodeX;
    let tooltipY: number;

    if (invertY) {
        tooltipY = nodeY + nodeSize / 2 + tooltipOffset + fixedHeight / 2;
    } else {
        tooltipY = nodeY - nodeSize / 2 - tooltipOffset - fixedHeight / 2;
    }

    if (invertY) {
        ctx.scale(1, -1);
        tooltipY = -tooltipY;
    }

    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 1;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    const borderRadius = 4;

    ctx.beginPath();

    ctx.moveTo(tooltipX - tooltipWidth / 2 + borderRadius, tooltipY - fixedHeight / 2);

    ctx.lineTo(tooltipX + tooltipWidth / 2 - borderRadius, tooltipY - fixedHeight / 2);

    ctx.quadraticCurveTo(
        tooltipX + tooltipWidth / 2,
        tooltipY - fixedHeight / 2,
        tooltipX + tooltipWidth / 2,
        tooltipY - fixedHeight / 2 + borderRadius,
    );

    ctx.lineTo(tooltipX + tooltipWidth / 2, tooltipY + fixedHeight / 2 - borderRadius);

    ctx.quadraticCurveTo(
        tooltipX + tooltipWidth / 2,
        tooltipY + fixedHeight / 2,
        tooltipX + tooltipWidth / 2 - borderRadius,
        tooltipY + fixedHeight / 2,
    );

    ctx.lineTo(tooltipX - tooltipWidth / 2 + borderRadius, tooltipY + fixedHeight / 2);

    ctx.quadraticCurveTo(
        tooltipX - tooltipWidth / 2,
        tooltipY + fixedHeight / 2,
        tooltipX - tooltipWidth / 2,
        tooltipY + fixedHeight / 2 - borderRadius,
    );

    ctx.lineTo(tooltipX - tooltipWidth / 2, tooltipY - fixedHeight / 2 + borderRadius);

    ctx.quadraticCurveTo(
        tooltipX - tooltipWidth / 2,
        tooltipY - fixedHeight / 2,
        tooltipX - tooltipWidth / 2 + borderRadius,
        tooltipY - fixedHeight / 2,
    );

    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = textColor;
    ctx.fillText(displayText, tooltipX, tooltipY);

    ctx.restore();
}
