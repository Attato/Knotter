import { useState, useEffect, RefObject } from 'react';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const DEFAULT_ZOOM = 1;

type Point = { x: number; y: number };

function getMousePos(
	e: MouseEvent,
	canvas: HTMLCanvasElement,
	offset: Point,
	scale: number
): Point {
	const rect = canvas.getBoundingClientRect();
	return {
		x: (e.clientX - rect.left - offset.x) / scale,
		y: (e.clientY - rect.top - offset.y) / scale,
	};
}

function handlePanEvents(
	canvas: HTMLCanvasElement,
	isDragging: boolean,
	setIsDragging: (val: boolean) => void,
	lastMousePos: Point | null,
	setLastMousePos: (val: Point | null) => void,
	setOffset: React.Dispatch<React.SetStateAction<Point>>
) {
	const onMouseDown = (e: MouseEvent) => {
		if (e.button !== 1) return;
		e.preventDefault();
		setIsDragging(true);
		setLastMousePos({ x: e.clientX, y: e.clientY });
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!isDragging || !lastMousePos) return;
		const dx = e.clientX - lastMousePos.x;
		const dy = e.clientY - lastMousePos.y;

		setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
		setLastMousePos({ x: e.clientX, y: e.clientY });
	};

	const onMouseUpOrLeave = (e: MouseEvent) => {
		if (e.button === 1 || e.type === 'mouseleave') {
			setIsDragging(false);
			setLastMousePos(null);
		}
	};

	canvas.addEventListener('mousedown', onMouseDown);
	canvas.addEventListener('mousemove', onMouseMove);
	canvas.addEventListener('mouseup', onMouseUpOrLeave);
	canvas.addEventListener('mouseleave', onMouseUpOrLeave);

	return () => {
		canvas.removeEventListener('mousedown', onMouseDown);
		canvas.removeEventListener('mousemove', onMouseMove);
		canvas.removeEventListener('mouseup', onMouseUpOrLeave);
		canvas.removeEventListener('mouseleave', onMouseUpOrLeave);
	};
}

function handleSelectionEvents(
	canvas: HTMLCanvasElement,
	offset: Point,
	scale: number,
	setSelectionStart: (val: Point | null) => void,
	setSelectionEnd: (val: Point | null) => void
) {
	const onMouseDown = (e: MouseEvent) => {
		if (e.button !== 0) return;
		const pos = getMousePos(e, canvas, offset, scale);
		setSelectionStart(pos);
		setSelectionEnd(pos);
	};

	const onMouseMove = (e: MouseEvent) => {
		if (e.buttons !== 1) return;
		const pos = getMousePos(e, canvas, offset, scale);
		setSelectionEnd(pos);
	};

	const onMouseUp = (e: MouseEvent) => {
		if (e.button === 0) {
			setSelectionStart(null);
			setSelectionEnd(null);
		}
	};

	canvas.addEventListener('mousedown', onMouseDown);
	canvas.addEventListener('mousemove', onMouseMove);
	canvas.addEventListener('mouseup', onMouseUp);

	return () => {
		canvas.removeEventListener('mousedown', onMouseDown);
		canvas.removeEventListener('mousemove', onMouseMove);
		canvas.removeEventListener('mouseup', onMouseUp);
	};
}

function handleZoomEvents(
	canvas: HTMLCanvasElement,
	scale: number,
	setScale: (val: number) => void,
	setOffset: React.Dispatch<React.SetStateAction<Point>>
) {
	const onWheel = (e: WheelEvent) => {
		e.preventDefault();

		const scaleFactor = 1.1;
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const zoom = e.deltaY < 0 ? scaleFactor : 1 / scaleFactor;
		let newScale = scale * zoom;
		newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale));

		setOffset((prev) => ({
			x: mouseX - (mouseX - prev.x) * (newScale / scale),
			y: mouseY - (mouseY - prev.y) * (newScale / scale),
		}));

		setScale(newScale);
	};

	canvas.addEventListener('wheel', onWheel, { passive: false });

	return () => {
		canvas.removeEventListener('wheel', onWheel);
	};
}

export function useCanvasControls(
	canvasRef: RefObject<HTMLCanvasElement | null>
) {
	const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
	const [scale, setScale] = useState(DEFAULT_ZOOM);
	const [isDragging, setIsDragging] = useState(false);
	const [lastMousePos, setLastMousePos] = useState<Point | null>(null);

	const [selectionStart, setSelectionStart] = useState<Point | null>(null);
	const [selectionEnd, setSelectionEnd] = useState<Point | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const removePanEvents = handlePanEvents(
			canvas,
			isDragging,
			setIsDragging,
			lastMousePos,
			setLastMousePos,
			setOffset
		);

		const removeSelectionEvents = handleSelectionEvents(
			canvas,
			offset,
			scale,
			setSelectionStart,
			setSelectionEnd
		);

		const removeZoomEvents = handleZoomEvents(
			canvas,
			scale,
			setScale,
			setOffset
		);

		return () => {
			removePanEvents();
			removeSelectionEvents();
			removeZoomEvents();
		};
	}, [canvasRef, isDragging, lastMousePos, scale, offset]);

	return {
		offset,
		scale,
		selectionStart,
		selectionEnd,
	};
}
