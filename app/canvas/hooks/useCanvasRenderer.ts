import { useEffect, RefObject } from 'react';

import { Point } from '@/canvas/canvas.types';

export function useCanvasRenderer(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    offset: Point,
    scale: number,
    selectionStart: Point | null,
    selectionEnd: Point | null,
) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 10, 10);

        if (selectionStart && selectionEnd) {
            const x = Math.min(selectionStart.x, selectionEnd.x);
            const y = Math.min(selectionStart.y, selectionEnd.y);
            const width = Math.abs(selectionEnd.x - selectionStart.x);
            const height = Math.abs(selectionEnd.y - selectionStart.y);

            ctx.fillStyle = 'rgba(0, 120, 215, 0.3)';
            ctx.fillRect(x, y, width, height);

            ctx.strokeStyle = 'rgba(0, 120, 215, 1)';
            ctx.lineWidth = 1 / scale;
            ctx.strokeRect(x, y, width, height);
        }

        ctx.restore();
    }, [scale, offset, canvasRef, selectionStart, selectionEnd]);
}
