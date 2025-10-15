'use client';

import { useRef } from 'react';

import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu/CanvasContextMenu';
import { CanvasControls } from '@/canvas/components/CanvasControls/CanvasControls';
import { CanvasStatusBar } from '@/canvas/components/CanvasStatusBar/CanvasStatusBar';

import { useCanvasInteraction } from '@/canvas/hooks/useCanvasInteraction';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/hooks/useContextMenu';

import { useCanvasStore } from '@/canvas/store/canvasStore';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const items = useCanvasStore((s) => s.items);
    const selectedItemIds = useCanvasStore((s) => s.selectedItemIds);
    const tempEdge = useCanvasStore((s) => s.tempEdge);
    const isMagnet = useCanvasStore((s) => s.isMagnet);
    const showGrid = useCanvasStore((s) => s.showGrid);
    const showAxes = useCanvasStore((s) => s.showAxes);
    const toggleShowGrid = useCanvasStore((s) => s.toggleShowGrid);
    const toggleShowAxes = useCanvasStore((s) => s.toggleShowAxes);

    const { selectionStart, selectionEnd } = useCanvasInteraction(canvasRef);

    useCanvasRenderer(canvasRef, selectionStart, selectionEnd, items, selectedItemIds, tempEdge, showGrid, showAxes);

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div className="flex h-screen relative" onClick={closeMenu}>
            <CanvasStatusBar canvasRef={canvasRef} />

            <CanvasControls
                isMagnet={isMagnet}
                showGrid={showGrid}
                showAxes={showAxes}
                toggleShowGrid={toggleShowGrid}
                toggleShowAxes={toggleShowAxes}
            />

            <CanvasContextMenu isOpen={isOpen} position={position} closeMenu={closeMenu} canvasRef={canvasRef} />

            <canvas ref={canvasRef} className="absolute w-full h-full" onContextMenu={handleContextMenu} />
        </div>
    );
}
