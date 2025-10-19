'use client';

import { RefObject, memo } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getCanvasCenter } from '@/canvas/utils/canvas/getCanvasCenter';

interface CanvasCoordinatesProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
}

export const CanvasCoordinates = memo(function CanvasCoordinates({ canvasRef }: CanvasCoordinatesProps) {
    const offset = useCanvasStore((state) => state.offset);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const invertY = useCanvasStore((state) => state.invertY);

    const center = canvasRef.current ? getCanvasCenter(canvasRef.current, { offset, zoomLevel, invertY }) : { x: 0, y: 0 };

    return (
        <div className="flex gap-1 tabular-nums">
            X: <p className="min-w-[5ch]">{Math.round(center.x)}</p> Y:
            <p className="min-w-[5ch]">{Math.round(center.y)}</p>
        </div>
    );
});
