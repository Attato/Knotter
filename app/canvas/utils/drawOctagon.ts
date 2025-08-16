export function drawOctagon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    fillStyle: string = '#0d0d0d',
) {
    const right = x + size;
    const bottom = y + size;
    const cut = 8;

    ctx.beginPath();
    ctx.moveTo(x + cut, y);
    ctx.lineTo(right - cut, y);
    ctx.lineTo(right, y + cut);
    ctx.lineTo(right, bottom - cut);
    ctx.lineTo(right - cut, bottom);
    ctx.lineTo(x + cut, bottom);
    ctx.lineTo(x, bottom - cut);
    ctx.lineTo(x, y + cut);
    ctx.closePath();

    ctx.fillStyle = fillStyle;
    ctx.fill();
}
