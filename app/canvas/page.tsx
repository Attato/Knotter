'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { Node } from '@/canvas/canvas.types';
import { handleAddNode } from '@/canvas/utils/handleAddNode';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);

    const { offset, zoomLevel, selectionStart, selectionEnd } = useCanvasControls(
        canvasRef,
        nodes,
        selectedNodeIds,
        setSelectedNodeIds,
        setNodes,
    );

    useCanvasRenderer(canvasRef, offset, zoomLevel, selectionStart, selectionEnd, nodes, selectedNodeIds);

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen relative">
            <Link href="/" className="absolute top-4 left-4">
                go to home
            </Link>
            <div className="absolute bottom-4 left-4">{zoomLevel.toFixed(2)}x</div>

            <button
                onClick={() => handleAddNode(nodes, setNodes)}
                className="absolute w-10 h-10 top-4 p-2 bg-black border rounded cursor-pointer"
            >
                +
            </button>

            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}
