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

            <div className="absolute top-4 right-4 flex gap-2 z-60">
                {[
                    { active: isMagnet, onClick: toggleMagnetMode, Icon: Magnet, label: 'Магнит (M)' },
                    { active: showGrid, onClick: toggleShowGrid, Icon: Grid2x2, label: 'Сетка (G)' },
                    { active: showAxes, onClick: toggleShowAxes, Icon: Move3d, label: 'Оси (A)' },
                ].map(({ active, onClick, Icon, label }, id) => (
                    <div key={id} className="relative group">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick();
                            }}
                            className={`p-2 rounded-md w-fit cursor-pointer ${
                                active ? 'bg-[#1f6feb]' : 'bg-[#151515] hover:bg-[#1a1a1a]'
                            }`}
                        >
                            <Icon size={16} />
                        </button>

                        <span className="absolute top-10 right-1/2 translate-x-1/2 px-2 py-1 text-xs text-white bg-[#0f0f0f] border border-[#1a1a1a] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {label}
                        </span>
                    </div>
                ))}
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
