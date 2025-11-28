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

import { getNodeColor } from '@/canvas/utils/nodes/getNodeColor';
import { drawTooltip } from '@/canvas/utils/nodes/drawTooltip';

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

interface NodeDimensions {
    width: number;
    height: number;
    headerHeight: number;
}

function getEditModeNodeDimensions(ctx: CanvasRenderingContext2D, node: Node, baseSize: number): NodeDimensions {
    const headerHeight = 24;
    const padding = 12;
    const minWidth = baseSize;

    ctx.font = '300 14px Inter, system-ui, sans-serif';
    const textWidth = ctx.measureText(node.name).width;
    const nodeWidth = Math.max(minWidth, textWidth + padding * 2);
    const nodeHeight = baseSize;

    return {
        width: nodeWidth,
        height: nodeHeight,
        headerHeight,
    };
}

function drawEditModeNode(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    node: Node,
    borderColor: string,
): NodeDimensions {
    const lineWidth = 1;

    const borderRadius = 4;
    const headerPaddingX = 0.5;
    const headerPaddingY = 0.5;
    const rootStyles = getComputedStyle(document.documentElement);

    const dimensions = getEditModeNodeDimensions(ctx, node, size);

    ctx.save();

    ctx.translate(x - dimensions.width / 2, y - dimensions.height / 2);

    ctx.beginPath();
    ctx.roundRect(0, 0, dimensions.width, dimensions.height, borderRadius);
    ctx.fillStyle = rootStyles.getPropertyValue('--border');
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(
        headerPaddingX,
        headerPaddingY,
        dimensions.width - headerPaddingX * 2,
        dimensions.headerHeight - headerPaddingY,
        [borderRadius - 0.5, borderRadius - 0.5, 0, 0],
    );

    const headerColor = getNodeColor(node.id);
    ctx.fillStyle = headerColor;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.name, headerPaddingX + 12, dimensions.headerHeight / 2);

    ctx.restore();

    return dimensions;
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
    const fillColor = rootStyles.getPropertyValue('--background').trim();
    const textColor = rootStyles.getPropertyValue('--foreground').trim();

    const tooltipMode = useCanvasStore.getState().tooltipMode;
    const editorMode = useCanvasStore.getState().editorMode;

    const isEditMode = editorMode === 'edit';

    const nodeDimensions = new Map<string, NodeDimensions>();

    for (const node of nodes) {
        const isSelected = selectedNodeIds.includes(node.id);
        const isHovered = hoveredNodeId === node.id;

        const { x, y } = node.position;

        const options = { fillStyle: fillColor, strokeStyle: strokeColor, lineWidth: 2 };

        const borderColor = isSelected
            ? rootStyles.getPropertyValue('--foreground').trim()
            : rootStyles.getPropertyValue('--level-7').trim();

        if (isEditMode) {
            const dimensions = drawEditModeNode(ctx, x, y, nodeSize, node, borderColor);
            nodeDimensions.set(node.id, dimensions);
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

        if (isSelected && !isEditMode) {
            ctx.save();

            const width = nodeSize;
            const height = nodeSize;

            ctx.beginPath();
            ctx.rect(x - width / 2 - padding, y - height / 2 - padding, width + 2 * padding, height + 2 * padding);

            ctx.lineWidth = 2;
            ctx.strokeStyle = borderColor;
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

    return nodeDimensions;
}
