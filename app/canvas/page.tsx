'use client';

import { useRef } from 'react';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/canvas/hooks/useContextMenu';

import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { nodes, selectedNodeIds, edges, tempEdge } = useCanvasStore();

    const { offset, zoomLevel, selectionStart, selectionEnd } = useCanvasControls(canvasRef);

    useCanvasRenderer(canvasRef, offset, zoomLevel, selectionStart, selectionEnd, nodes, selectedNodeIds, edges, tempEdge);

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen relative" onClick={closeMenu}>
            <div className="absolute bottom-4 left-4 select-none">{zoomLevel.toFixed(2)}x</div>

            <CanvasContextMenu
                isOpen={isOpen}
                position={position}
                closeMenu={closeMenu}
                offset={offset}
                zoomLevel={zoomLevel}
                canvasRef={canvasRef}
            />

            {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center text-[#aaa] text-sm">
                        Нажмите <strong className="pl-1"> ПКМ </strong>, чтобы начать творить.
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} className="w-full h-full" onContextMenu={handleContextMenu} />
        </div>
    );
}
