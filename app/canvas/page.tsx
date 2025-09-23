'use client';

import { useRef } from 'react';

import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu';
import { CanvasControls } from '@/canvas/components/CanvasControls';
import { CanvasStatusBar } from '@/canvas/components/CanvasStatusBar';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/hooks/useContextMenu';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { items, selectedItemIds, tempEdge, isMagnet, showGrid, toggleShowGrid, showAxes, toggleShowAxes } =
        useCanvasStore();

    const { selectionStart, selectionEnd } = useCanvasControls(canvasRef);

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
