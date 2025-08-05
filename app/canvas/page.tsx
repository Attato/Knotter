'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { Node } from '@/canvas/canvas.types';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([]);

    const { offset, zoomLevel, selectionStart, selectionEnd } = useCanvasControls(canvasRef, nodes, setSelectedNodeIds);

    useCanvasRenderer(canvasRef, offset, zoomLevel, selectionStart, selectionEnd, nodes, selectedNodeIds);

    const handleAddNode = () => {
        const step = 10;
        let x = 0;
        let y = 0;

        while (nodes.some((node) => node.position.x === x && node.position.y === y)) {
            x += step;
            y += step;
        }

        const newNode: Node = {
            id: nodes.length > 0 ? nodes[nodes.length - 1].id + 1 : 1,
            type: 'square',
            position: { x, y },
        };

        setNodes((prev) => [...prev, newNode]);
    };

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen relative">
            <Link href="/" className="absolute top-4 left-4">
                go to home
            </Link>
            <div className="absolute bottom-4 left-4">{zoomLevel.toFixed(2)}x</div>

            <button onClick={handleAddNode} className="absolute w-10 h-10 top-4 p-2 bg-black border rounded cursor-pointer">
                +
            </button>

            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}
