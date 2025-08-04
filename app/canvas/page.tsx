'use client';

import { useRef } from 'react';

import Link from 'next/link';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { offset, zoomLevel, selectionStart, selectionEnd } = useCanvasControls(canvasRef);

    useCanvasRenderer(canvasRef, offset, zoomLevel, selectionStart, selectionEnd);

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen">
            <Link href="/" className="absolute top-4 left-4">
                go to home
            </Link>
            <div className="absolute bottom-4 left-4">{zoomLevel.toFixed(2)}x</div>
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}
