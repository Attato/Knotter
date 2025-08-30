import { Position } from '@/canvas/canvas.types';

export function drawGrid(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    zoom: number,
    offset: Position,
    baseGridSize = 50,
    showGrid = false,
    showAxes = false,
) {
    ctx.save();
    ctx.setTransform(zoom, 0, 0, zoom, offset.x, offset.y);

    const lineWidth = 1 / zoom;
    ctx.lineWidth = lineWidth;

    const worldLeft = -offset.x / zoom;
    const worldTop = -offset.y / zoom;
    const worldRight = worldLeft + canvasWidth / zoom;
    const worldBottom = worldTop + canvasHeight / zoom;

    if (showGrid) {
        const levels = [
            { step: baseGridSize, color: '#1a1a1a' },
            { step: baseGridSize * 10, color: '#2a2a2a' },
            { step: baseGridSize * 100, color: '#3a3a3a' },
        ];

        for (const { step, color } of levels) {
            if (step * zoom < 8) continue;

            ctx.beginPath();
            ctx.strokeStyle = color;

            const startX = Math.floor(worldLeft / step) * step;
            for (let x = startX; x <= worldRight; x += step) {
                ctx.moveTo(x, worldTop);
                ctx.lineTo(x, worldBottom);
            }

            const startY = Math.floor(worldTop / step) * step;
            for (let y = startY; y <= worldBottom; y += step) {
                ctx.moveTo(worldLeft, y);
                ctx.lineTo(worldRight, y);
            }

            ctx.stroke();
        }
    }

    if (showAxes) {
        ctx.beginPath();
        ctx.strokeStyle = '#e74c3c';
        ctx.moveTo(0, worldTop);
        ctx.lineTo(0, worldBottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#27ae60';
        ctx.moveTo(worldLeft, 0);
        ctx.lineTo(worldRight, 0);
        ctx.stroke();
    }

    ctx.restore();
}
