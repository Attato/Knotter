'use client';

import { useRef, useState } from 'react';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/hooks/useContextMenu';

import { NODE_MOVE_MIN_STEP, NODE_MOVE_MAX_STEP } from '@/canvas/constants';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu';

import { Grid2x2, Move3d, Magnet } from 'lucide-react';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const {
        nodes,
        setNodes,
        isMagnet,
        setIsMagnet,
        selectedNodeIds,
        edges,
        tempEdge,
        showGrid,
        setShowGrid,
        showAxes,
        setShowAxes,
    } = useCanvasStore();

    const nodeMoveStep = isMagnet ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP;

    const { offset, zoomLevel, selectionStart, selectionEnd } = useCanvasControls(canvasRef);

    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left - offset.x) / zoomLevel;
        const y = (e.clientY - rect.top - offset.y) / zoomLevel;

        const clickedNode = nodes.find((n) => Math.hypot(n.position.x - x, n.position.y - y) < 15);

        if (clickedNode) {
            setDraggingNodeId(clickedNode.id);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingNodeId) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        let x = (e.clientX - rect.left - offset.x) / zoomLevel;
        let y = (e.clientY - rect.top - offset.y) / zoomLevel;

        if (isMagnet) {
            x = Math.round(x / nodeMoveStep) * nodeMoveStep;
            y = Math.round(y / nodeMoveStep) * nodeMoveStep;
        }

        setNodes(nodes.map((n) => (n.id === draggingNodeId ? { ...n, position: { x, y } } : n)));
    };

    const handleMouseUp = () => {
        setDraggingNodeId(null);
    };

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

            <div className="absolute top-4 right-4 flex gap-2 z-50">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMagnet();
                    }}
                    className={`p-2 rounded-md w-fit cursor-pointer ${
                        isMagnet ? 'bg-[#1f6feb]' : 'bg-[#151515] hover:bg-[#1a1a1a]'
                    }`}
                >
                    <Magnet size={16} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowGrid();
                    }}
                    className={`p-2 rounded-md w-fit cursor-pointer ${
                        showGrid ? 'bg-[#1f6feb]' : 'bg-[#151515] hover:bg-[#1a1a1a]'
                    }`}
                >
                    <Grid2x2 size={16} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowAxes();
                    }}
                    className={`p-2 rounded-md w-fit cursor-pointer ${
                        showAxes ? 'bg-[#1f6feb]' : 'bg-[#151515] hover:bg-[#1a1a1a]'
                    }`}
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

            <canvas
                ref={canvasRef}
                className="fixed w-full h-full"
                onContextMenu={handleContextMenu}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
        </div>
    );
}
