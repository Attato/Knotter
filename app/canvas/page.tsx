'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';

export default function Canvas() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const { offset, scale } = useCanvasControls(canvasRef);

	useCanvasRenderer(canvasRef, offset, scale);

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
