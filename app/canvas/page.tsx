'use client';

import { useRef } from 'react';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/hooks/useContextMenu';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu';

import { toggleMagnetMode } from '@/canvas/utils/toggleMagnetMode';

import { Grid2x2, Move3d, Magnet } from 'lucide-react';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { nodes, selectedNodeIds, edges, tempEdge, isMagnet, showGrid, setShowGrid, showAxes, setShowAxes } =
        useCanvasStore();

    const { offset, zoomLevel, selectionStart, selectionEnd } = useCanvasControls(canvasRef);

    useCanvasRenderer(
        canvasRef,
        offset,
        zoomLevel,
        selectionStart,
        selectionEnd,
        nodes,
        selectedNodeIds,
        edges,
        tempEdge,
        showGrid,
        showAxes,
    );

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen relative" onClick={closeMenu}>
            <div className="absolute bottom-4 left-4 select-none z-50">{zoomLevel.toFixed(2)}x</div>

            <div className="absolute top-4 right-4 flex gap-2 z-50">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMagnetMode();
                    }}
                    className={`p-2 rounded-md w-fit cursor-pointer ${isMagnet ? 'bg-[#1f6feb]' : 'bg-[#151515] hover:bg-[#1a1a1a]'}`}
                >
                    <Magnet size={16} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowGrid(!showGrid);
                    }}
                    className={`p-2 rounded-md w-fit cursor-pointer ${showGrid ? 'bg-[#1f6feb]' : 'bg-[#151515] hover:bg-[#1a1a1a]'}`}
                >
                    <Grid2x2 size={16} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowAxes(!showAxes);
                    }}
                    className={`p-2 rounded-md w-fit cursor-pointer ${showAxes ? 'bg-[#1f6feb]' : 'bg-[#151515] hover:bg-[#1a1a1a]'}`}
                >
                    <Move3d size={16} />
                </button>
            </div>

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
