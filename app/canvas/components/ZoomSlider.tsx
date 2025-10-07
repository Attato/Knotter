'use client';

import { useRef, useEffect, useState, memo } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { MIN_ZOOM, MAX_ZOOM } from '@/canvas/constants';

interface ZoomSliderProps {
    width?: number;
    height?: number;
}

export const ZoomSlider = memo(function ZoomSlider({ width = 150, height = 2 }: ZoomSliderProps) {
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const setZoomLevel = useCanvasStore((state) => state.setZoomLevel);

    const [isReady, setIsReady] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    const zoomRatio = MAX_ZOOM / MIN_ZOOM;

    const sliderToZoom = (value: number) => MIN_ZOOM * Math.pow(zoomRatio, value);
    const zoomToSlider = (zoom: number) => Math.log(zoom / MIN_ZOOM) / Math.log(zoomRatio);

    const calculateAndSetZoom = (clientX: number) => {
        if (!sliderRef.current) return;

        const sliderRect = sliderRef.current.getBoundingClientRect();

        let pointerX = clientX - sliderRect.left;
        pointerX = Math.max(0, Math.min(sliderRect.width, pointerX));

        const normalizedPosition = pointerX / sliderRect.width;
        let calculatedZoom = sliderToZoom(normalizedPosition);

        if (calculatedZoom > 0.9 && calculatedZoom < 1.2) calculatedZoom = 1;

        setZoomLevel(calculatedZoom);
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!isDragging.current) return;

        calculateAndSetZoom(e.clientX);
    };

    const handlePointerUp = () => {
        isDragging.current = false;

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
    };

    const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
        calculateAndSetZoom(e.clientX);

        isDragging.current = true;

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    if (!isReady) {
        return (
            <div className="flex items-center space-x-2 opacity-0 select-none" style={{ width }}>
                <div style={{ width, height }} />
                <span className="min-w-[6ch] text-right"> </span>
            </div>
        );
    }

    const sliderPos = zoomToSlider(zoomLevel);
    const markerPos = zoomToSlider(1);

    return (
        <div className="flex items-center space-x-2">
            <div
                ref={sliderRef}
                className={`relative bg-border-light rounded cursor-pointer`}
                style={{ width: `${width}px`, height: `${height}px` }}
                onPointerDown={handlePointerDown}
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
});
