export function drawOctagon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    fillStyle: string = '#0d0d0d',
) {
    const r = size / 2;
    const cut = r / 2.5;
    const left = cx - r;
    const right = cx + r;
    const top = cy - r;
    const bottom = cy + r;

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

    ctx.fillStyle = fillStyle;
    ctx.fill();
}
