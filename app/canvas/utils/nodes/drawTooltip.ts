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

export function drawTooltip({
    ctx,
    text,
    nodeX,
    nodeY,
    nodeSize,
    textColor,
    backgroundColor,
    invertY = false,
}: DrawTooltipProps) {
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
