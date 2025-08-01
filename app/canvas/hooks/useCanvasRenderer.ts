import { useEffect, RefObject } from 'react';

export function useCanvasRenderer(
	canvasRef: RefObject<HTMLCanvasElement | null>,
	offset: { x: number; y: number },
	scale: number
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

		ctx.restore();
	}, [scale, offset, canvasRef]);
}
