'use client';

import { useRef } from 'react';

import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu';
import { CanvasControls } from '@/canvas/components/CanvasControls';
import { ZoomSlider } from './components/ZoomSlider';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/hooks/useContextMenu';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { getCanvasCenter } from './utils/getCanvasCenter';

import { MAX_CANVAS_ITEMS } from './constants';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { items, selectedItemIds, tempEdge, isMagnet, showGrid, toggleShowGrid, showAxes, toggleShowAxes } =
        useCanvasStore();

    const { selectionStart, selectionEnd } = useCanvasControls(canvasRef);

    useCanvasRenderer(canvasRef, selectionStart, selectionEnd, items, selectedItemIds, tempEdge, showGrid, showAxes);

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    const center = canvasRef.current ? getCanvasCenter(canvasRef.current) : { x: 0, y: 0 };

    return (
        <div className="flex h-screen relative" onClick={closeMenu}>
            <div className="flex items-center justify-end w-full h-[42px] absolute bottom-0 left-0 z-50 py-1 px-4 bg-background-alt border-t border-border text-xs select-none">
                <div className="flex items-center gap-6">
                    <div className="flex gap-1 tabular-nums">
                        X: <p className="min-w-[5ch]">{Math.round(center.x)}</p> Y:
                        <p className="min-w-[5ch]">{Math.round(center.y)}</p>
                    </div>

                    <p className="tabular-nums">
                        Количество: {items.length} / {MAX_CANVAS_ITEMS}
                    </p>

                    <ZoomSlider />
                </div>
            </div>

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
