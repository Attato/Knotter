import { useState, useEffect, RefObject } from 'react';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const DEFAULT_ZOOM = 1;

type Point = { x: number; y: number };

export function useCanvasControls(
	canvasRef: RefObject<HTMLCanvasElement | null>
) {
	const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
	const [scale, setScale] = useState(DEFAULT_ZOOM);
	const [isDragging, setIsDragging] = useState(false);
	const [lastMousePos, setLastMousePos] = useState<Point | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const startPan = (e: MouseEvent) => {
			if (e.button === 1) {
				e.preventDefault();
				setIsDragging(true);
				setLastMousePos({ x: e.clientX, y: e.clientY });
			}
		};

		const performPan = (e: MouseEvent) => {
			if (!isDragging || !lastMousePos) return;

			const dx = e.clientX - lastMousePos.x;
			const dy = e.clientY - lastMousePos.y;

			setOffset((prev) => ({
				x: prev.x + dx,
				y: prev.y + dy,
			}));

			setLastMousePos({ x: e.clientX, y: e.clientY });
		};

		const endPan = (e: MouseEvent) => {
			if (e.button === 1) {
				setIsDragging(false);
				setLastMousePos(null);
			}
		};

		const applyZoom = (e: WheelEvent) => {
			e.preventDefault();
			if (!canvas) return;

			const scaleFactor = 1.1;
			const mouseX = e.clientX - canvas.getBoundingClientRect().left;
			const mouseY = e.clientY - canvas.getBoundingClientRect().top;

			const zoom = e.deltaY < 0 ? scaleFactor : 1 / scaleFactor;
			let tentativeScale = scale * zoom;
			tentativeScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, tentativeScale));

			setOffset((prev) => ({
				x: mouseX - (mouseX - prev.x) * (tentativeScale / scale),
				y: mouseY - (mouseY - prev.y) * (tentativeScale / scale),
			}));

			setScale(tentativeScale);
		};

		canvas.addEventListener('mousedown', startPan);
		canvas.addEventListener('mousemove', performPan);
		canvas.addEventListener('mouseup', endPan);
		canvas.addEventListener('mouseleave', endPan);
		canvas.addEventListener('wheel', applyZoom, { passive: false });

		return () => {
			canvas.removeEventListener('mousedown', startPan);
			canvas.removeEventListener('mousemove', performPan);
			canvas.removeEventListener('mouseup', endPan);
			canvas.removeEventListener('mouseleave', endPan);
			canvas.removeEventListener('wheel', applyZoom);
		};
	}, [isDragging, lastMousePos, scale, canvasRef]);

	return {
		offset,
		scale,
	};
}
