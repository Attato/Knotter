'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

import { Node } from '@/canvas/canvas.types';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/canvas/hooks/useContextMenu';

import { handleAddNode } from '@/canvas/utils/handleAddNode';

import { ContextMenu } from '@/canvas/components/ContextMenu';
import { ContextMenuItem } from '@/canvas/components/ContextMenuItem';

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

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen relative" onClick={closeMenu}>
            <Link href="/" className="absolute top-4 left-4">
                На главную
            </Link>

            <div className="absolute bottom-4 left-4">{zoomLevel.toFixed(2)}x</div>

            <ContextMenu isOpen={isOpen} position={position} onClose={closeMenu}>
                <ContextMenuItem
                    onClick={() => {
                        handleAddNode(nodes, setNodes);
                        closeMenu();
                    }}
                >
                    Добавить узел
                </ContextMenuItem>

                <ContextMenuItem
                    onClick={() => {
                        setNodes((prev) => prev.filter((node) => !selectedNodeIds.includes(node.id)));
                        setSelectedNodeIds([]);
                        closeMenu();
                    }}
                    disabled={selectedNodeIds.length === 0}
                >
                    Удалить выбранное
                </ContextMenuItem>
            </ContextMenu>

            <canvas ref={canvasRef} className="w-full h-full" onContextMenu={handleContextMenu} />
        </div>
    );
}
