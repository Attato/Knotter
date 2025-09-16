'use client';

import { useRef } from 'react';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu';
import { CanvasControls } from '@/canvas/components/CanvasControls';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { items, selectedItemIds, tempEdge, isMagnet, showGrid, toggleShowGrid, showAxes, toggleShowAxes } =
        useCanvasStore();

    const { offset, zoomLevel, selectionStart, selectionEnd } = useCanvasControls(canvasRef);

    useCanvasRenderer(
        canvasRef,
        offset,
        zoomLevel,
        selectionStart,
        selectionEnd,
        items,
        selectedItemIds,
        tempEdge,
        showGrid,
        showAxes,
    );

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen relative" onClick={closeMenu}>
            <div className="absolute bottom-4 left-4 select-none z-50">{zoomLevel.toFixed(2)}x</div>

            <CanvasControls
                isMagnet={isMagnet}
                showGrid={showGrid}
                showAxes={showAxes}
                toggleShowGrid={toggleShowGrid}
                toggleShowAxes={toggleShowAxes}
            />

            <CanvasContextMenu
                isOpen={isOpen}
                position={position}
                closeMenu={closeMenu}
                offset={offset}
                zoomLevel={zoomLevel}
                canvasRef={canvasRef}
            />

            <canvas ref={canvasRef} className="fixed w-full h-full" onContextMenu={handleContextMenu} />
        </div>
    );
}
