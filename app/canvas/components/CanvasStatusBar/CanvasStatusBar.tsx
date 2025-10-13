'use client';

import { RefObject, memo } from 'react';

import { MAX_CANVAS_ITEMS } from '@/canvas/constants';

import { CanvasCoordinates } from '@/canvas/components/CanvasStatusBar/CanvasCoordinates'; // импортируем новый компонент
import { ZoomSlider } from '@/canvas/components/CanvasStatusBar/ZoomSlider';

import { useCanvasStore } from '@/canvas/store/canvasStore';

interface CanvasStatusBarProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
}

const CanvasItemsCount = memo(function CanvasItemsCount() {
    const itemsCount = useCanvasStore((state) => state.items.length);

    return (
        <p className="tabular-nums">
            Количество: {itemsCount} / {MAX_CANVAS_ITEMS}
        </p>
    );
});

export const CanvasStatusBar = memo(function CanvasStatusBar({ canvasRef }: CanvasStatusBarProps) {
    return (
        <div className="flex items-center justify-end w-full h-[42px] absolute bottom-0 left-0 z-50 py-1 px-4 bg-background-alt border-t border-border text-xs select-none">
            <div className="flex items-center gap-6">
                <CanvasCoordinates canvasRef={canvasRef} />

                <CanvasItemsCount />

                <ZoomSlider />
            </div>
        </div>
    );
});
