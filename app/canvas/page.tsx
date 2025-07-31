'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Canvas() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;
	}, []);

	return (
		<div className="flex flex-col items-center justify-center gap-2 h-screen">
			<Link href="/" className="absolute top-4 left-4">
				go to home
			</Link>

			<canvas ref={canvasRef} className="w-full h-full"></canvas>
		</div>
	);
}
