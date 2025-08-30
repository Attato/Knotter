'use client';

import { useRef } from 'react';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/canvas/hooks/useContextMenu';

import { NODE_MOVE_MIN_STEP, NODE_MOVE_MAX_STEP } from '@/canvas/constants';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu';

import { Grid2x2, Move3d, Magnet } from 'lucide-react';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const {
        nodes,
        nodeMoveStep,
        setNodeMoveStep,
        selectedNodeIds,
        edges,
        tempEdge,
        showGrid,
        setShowGrid,
        showAxes,
        setShowAxes,
    } = useCanvasStore();

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
            <div className="absolute bottom-4 left-4 select-none">{zoomLevel.toFixed(2)}x</div>

            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setNodeMoveStep(nodeMoveStep === NODE_MOVE_MIN_STEP ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP);
                    }}
                    className={`p-2 rounded-md w-fit cursor-pointer ${
                        nodeMoveStep > 1 ? 'bg-[#1f6feb]' : 'bg-[#151515] hover:bg-[#1a1a1a]'
                    }`}
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

            {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center text-[#aaa] text-sm">
                        Не знаете с чего начать? Начните с <strong className="pl-1"> ПКМ </strong>.
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} className="w-full h-full" onContextMenu={handleContextMenu} />
        </div>
    );
}
