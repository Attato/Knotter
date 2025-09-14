'use client';

import { useRef } from 'react';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/hooks/useContextMenu';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu';
import { Tooltip } from '@/components/UI/Tooltip';

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

    const canvasControls = [
        { active: isMagnet, onClick: toggleMagnetMode, Icon: Magnet, label: 'Магнит (M)' },
        { active: showGrid, onClick: toggleShowGrid, Icon: Grid2x2, label: 'Сетка (G)' },
        { active: showAxes, onClick: toggleShowAxes, Icon: Move3d, label: 'Оси (A)' },
    ];

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen relative" onClick={closeMenu}>
            <div className="absolute bottom-4 left-4 select-none z-50">{zoomLevel.toFixed(2)}x</div>

            <div className="absolute top-4 right-4 flex gap-2 z-60">
                {canvasControls.map(({ active, onClick, Icon, label }, index) => (
                    <Tooltip key={index} label={label}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick();
                            }}
                            className={`p-2 rounded-md w-fit cursor-pointer ${active ? 'bg-accent text-white' : 'bg-card hover:bg-ui'}`}
                        >
                            <Icon size={16} />
                        </button>
                    </Tooltip>
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
