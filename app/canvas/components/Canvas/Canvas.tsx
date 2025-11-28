'use client';

import { useRef } from 'react';

import { CanvasContextMenu } from '@/canvas/components/CanvasContextMenu/CanvasContextMenu';
import { CanvasControls } from '@/canvas/components/CanvasControls/CanvasControls';

import { useCanvasSelection } from '@/canvas/hooks/useCanvasSelection';
import { useCanvasInteraction } from '@/canvas/hooks/useCanvasInteraction';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/hooks/useContextMenu';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, selectItemsInArea } = useCanvasSelection();

    useCanvasInteraction({
        canvasRef,
        selectionStart,
        setSelectionStart,
        setSelectionEnd,
        selectItemsInArea,
    });

    useCanvasRenderer({ canvasRef, selectionStart, selectionEnd });

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div className="flex h-screen relative" onClick={closeMenu}>
            <CanvasControls />

            <CanvasContextMenu isOpen={isOpen} position={position} closeMenu={closeMenu} canvasRef={canvasRef} />

            <canvas ref={canvasRef} className="absolute w-full h-full" onContextMenu={handleContextMenu} />
        </div>
    );
}
