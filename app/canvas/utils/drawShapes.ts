import { DrawOptions } from '@/canvas/canvas.types';

function fillAndStroke(ctx: CanvasRenderingContext2D, fillStyle: string, strokeStyle?: string, lineWidth: number = 1) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
    if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
}

export function drawOctagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, options: DrawOptions = {}) {
    const { fillStyle = '#0d0d0d', strokeStyle, lineWidth = 1 } = options;
    const r = size / 2;
    const cut = r / 2.5;
    const left = cx - r;
    const right = cx + r;
    const top = cy - r;
    const bottom = cy + r;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(left + cut, top);
    ctx.lineTo(right - cut, top);
    ctx.lineTo(right, top + cut);
    ctx.lineTo(right, bottom - cut);
    ctx.lineTo(right - cut, bottom);
    ctx.lineTo(left + cut, bottom);
    ctx.lineTo(left, bottom - cut);
    ctx.lineTo(left, top + cut);
    ctx.closePath();

    fillAndStroke(ctx, fillStyle, strokeStyle, lineWidth);
    ctx.restore();
}

export function drawCircle(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    options: DrawOptions = {},
) {
    const { fillStyle = '#0d0d0d', strokeStyle, lineWidth = 1 } = options;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();

    fillAndStroke(ctx, fillStyle, strokeStyle, lineWidth);
    ctx.restore();
}

export function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, options: DrawOptions = {}) {
    const { fillStyle = '#0d0d0d', strokeStyle, lineWidth = 1, cornerRadius = 4 } = options;

    const half = size / 2;

    const points = [
        { x: cx, y: cy - half },
        { x: cx + half, y: cy },
        { x: cx, y: cy + half },
        { x: cx - half, y: cy },
    ];

    ctx.save();
    ctx.beginPath();

    for (let i = 0; i < 4; i++) {
        const curr = points[i];
        const next = points[(i + 1) % 4];
        const prev = points[(i + 3) % 4];

        const vPrev = { x: curr.x - prev.x, y: curr.y - prev.y };
        const vNext = { x: next.x - curr.x, y: next.y - curr.y };

        const lenPrev = Math.hypot(vPrev.x, vPrev.y);
        const lenNext = Math.hypot(vNext.x, vNext.y);

        const p1 = { x: curr.x - (vPrev.x / lenPrev) * cornerRadius, y: curr.y - (vPrev.y / lenPrev) * cornerRadius };
        const p2 = { x: curr.x + (vNext.x / lenNext) * cornerRadius, y: curr.y + (vNext.y / lenNext) * cornerRadius };

        if (i === 0) ctx.moveTo(p1.x, p1.y);
        else ctx.lineTo(p1.x, p1.y);

        ctx.quadraticCurveTo(curr.x, curr.y, p2.x, p2.y);
    }

    ctx.closePath();

    fillAndStroke(ctx, fillStyle, strokeStyle, lineWidth);
    ctx.restore();
}

export function drawTriangle(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    options: DrawOptions = {},
) {
    const { fillStyle = '#0d0d0d', strokeStyle, lineWidth = 1, cornerRadius = 4 } = options;

    const height = (Math.sqrt(3) / 2) * size;
    const half = size / 2;

    const points = [
        { x: cx, y: cy - height / 2 },
        { x: cx + half, y: cy + height / 2 },
        { x: cx - half, y: cy + height / 2 },
    ];

    ctx.save();
    ctx.beginPath();

    for (let i = 0; i < 3; i++) {
        const curr = points[i];
        const next = points[(i + 1) % 3];
        const prev = points[(i + 2) % 3];

        const vPrev = { x: curr.x - prev.x, y: curr.y - prev.y };
        const vNext = { x: next.x - curr.x, y: next.y - curr.y };

        const lenPrev = Math.hypot(vPrev.x, vPrev.y);
        const lenNext = Math.hypot(vNext.x, vNext.y);

        const p1 = { x: curr.x - (vPrev.x / lenPrev) * cornerRadius, y: curr.y - (vPrev.y / lenPrev) * cornerRadius };
        const p2 = { x: curr.x + (vNext.x / lenNext) * cornerRadius, y: curr.y + (vNext.y / lenNext) * cornerRadius };

        if (i === 0) ctx.moveTo(p1.x, p1.y);
        else ctx.lineTo(p1.x, p1.y);

        ctx.quadraticCurveTo(curr.x, curr.y, p2.x, p2.y);
    }

    ctx.closePath();

    fillAndStroke(ctx, fillStyle, strokeStyle, lineWidth);
    ctx.restore();
}

export function drawHexagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, options: DrawOptions = {}) {
    const { fillStyle = '#0d0d0d', strokeStyle, lineWidth = 1 } = options;
    const r = size / 2;

    ctx.save();
    ctx.beginPath();

    for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.closePath();

    fillAndStroke(ctx, fillStyle, strokeStyle, lineWidth);
    ctx.restore();
}

export function drawSquircle(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    options: DrawOptions = {},
) {
    const { fillStyle = '#0d0d0d', strokeStyle, lineWidth = 1 } = options;
    const r = size / 2;
    const cornerRadius = r / 2;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - r + cornerRadius, cy - r);
    ctx.lineTo(cx + r - cornerRadius, cy - r);
    ctx.quadraticCurveTo(cx + r, cy - r, cx + r, cy - r + cornerRadius);
    ctx.lineTo(cx + r, cy + r - cornerRadius);
    ctx.quadraticCurveTo(cx + r, cy + r, cx + r - cornerRadius, cy + r);
    ctx.lineTo(cx - r + cornerRadius, cy + r);
    ctx.quadraticCurveTo(cx - r, cy + r, cx - r, cy + r - cornerRadius);
    ctx.lineTo(cx - r, cy - r + cornerRadius);
    ctx.quadraticCurveTo(cx - r, cy - r, cx - r + cornerRadius, cy - r);
    ctx.closePath();

    fillAndStroke(ctx, fillStyle, strokeStyle, lineWidth);
    ctx.restore();
}

export function drawPoint(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number = 3,
    options: DrawOptions = {},
) {
    const { fillStyle = '#ffffff', strokeStyle, lineWidth = 1 } = options;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();

    fillAndStroke(ctx, fillStyle, strokeStyle, lineWidth);
    ctx.restore();
}
