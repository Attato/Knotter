'use client';

import { RefObject } from 'react';

import { ZoomSlider } from '@/canvas/components/ZoomSlider';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { getCanvasCenter } from '@/canvas/utils/getCanvasCenter';

import { MAX_CANVAS_ITEMS } from '@/canvas/constants';

interface CanvasStatusBarProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function CanvasStatusBar({ canvasRef }: CanvasStatusBarProps) {
    const { items } = useCanvasStore();

    const center = canvasRef.current ? getCanvasCenter(canvasRef.current) : { x: 0, y: 0 };

    return (
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
    );
}
