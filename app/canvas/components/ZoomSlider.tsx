'use client';

import { useRef, useState, useEffect } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { MIN_ZOOM, MAX_ZOOM } from '@/canvas/constants';

interface ZoomSliderProps {
    width?: number;
    height?: number;
}

export function ZoomSlider({ width = 150, height = 2 }: ZoomSliderProps) {
    const { zoomLevel, setZoomLevel } = useCanvasStore();
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const sliderToZoom = (value: number) => MIN_ZOOM * Math.pow(MAX_ZOOM / MIN_ZOOM, value);

    const zoomToSlider = (zoom: number) => Math.log(zoom / MIN_ZOOM) / Math.log(MAX_ZOOM / MIN_ZOOM);

    const handlePointerUp = () => setIsDragging(false);

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!isDragging || !sliderRef.current) return;

            const rect = sliderRef.current.getBoundingClientRect();
            let x = e.clientX - rect.left;
            x = Math.max(0, Math.min(rect.width, x));
            const t = x / rect.width;

            let newZoom = sliderToZoom(t);

            if (newZoom > 0.9 && newZoom < 1.2) newZoom = 1;

            setZoomLevel(newZoom);
        };

        if (isDragging) {
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        } else {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        }

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging, setZoomLevel]);

    const sliderPos = zoomToSlider(zoomLevel);
    const markerPos = zoomToSlider(1);

    return (
        <div className="flex items-center space-x-2">
            <div
                ref={sliderRef}
                className={`relative bg-border-light rounded cursor-pointer`}
                style={{ width: `${width}px`, height: `${height}px` }}
                onPointerDown={() => setIsDragging(true)}
            >
                <div
                    className="absolute top-[-2px] bg-border-light w-[2px]"
                    style={{ left: `${markerPos * 100}%`, height: `${height + 4}px` }}
                />

                <div
                    className={`absolute top-[-4px] bg-bg-accent w-[6px] -translate-x-1/2`}
                    style={{
                        left: `${sliderPos * 100}%`,
                        height: `${height + 8}px`,
                    }}
                />
            </div>

            <span className="tabular-nums min-w-[6ch] text-right">{Math.round(zoomLevel * 100)}%</span>
        </div>
    );
}
