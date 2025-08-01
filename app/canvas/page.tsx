'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const DEFAULT_ZOOM = 1;

export default function Canvas() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const [isDragging, setIsDragging] = useState(false);
	const [lastMousePos, setLastMousePos] = useState<{
		x: number;
		y: number;
	} | null>(null);

	const offset = useRef({ x: 0, y: 0 });
	const [scale, setScale] = useState(DEFAULT_ZOOM);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		const renderScene = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.save();
			ctx.translate(offset.current.x, offset.current.y);
			ctx.scale(scale, scale);

			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, 10, 10);

			ctx.restore();
		};

		renderScene();
	}, [scale, offset.current.x, offset.current.y]);

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

			offset.current.x += dx;
			offset.current.y += dy;

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

			const scaleFactor = 1.1;
			const mouseX = e.clientX - canvas.getBoundingClientRect().left;
			const mouseY = e.clientY - canvas.getBoundingClientRect().top;

			const zoom = e.deltaY < 0 ? scaleFactor : 1 / scaleFactor;
			let tentativeScale = scale * zoom;

			tentativeScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, tentativeScale));

			offset.current.x =
				mouseX - (mouseX - offset.current.x) * (tentativeScale / scale);
			offset.current.y =
				mouseY - (mouseY - offset.current.y) * (tentativeScale / scale);

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
	}, [isDragging, lastMousePos, scale]);

	return (
		<div className="flex flex-col items-center justify-center gap-2 h-screen">
			<Link href="/" className="absolute top-4 left-4">
				go to home
			</Link>

			<div className="absolute bottom-4 left-4">scale: {scale.toFixed(2)}</div>

			<canvas ref={canvasRef} className="w-full h-full" />
		</div>
	);
}
