'use client';

import { memo } from 'react';

import { InfiniteSliderInput } from '@/components/UI/InfiniteSliderInput';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { NODE_MOVE_MAX_STEP, NODE_MOVE_MIN_STEP } from '@/canvas/canvas.constants';

interface PositionInputsProps {
    positionX: number;
    positionY: number;
    onMove: (axis: 'x' | 'y', value: number) => void;
}

export const PositionInputs = memo(function PositionInputs({ positionX, positionY, onMove }: PositionInputsProps) {
    const isMagnet = useCanvasStore((state) => state.isMagnet);

    return (
        <>
            <InfiniteSliderInput
                name="Положение X"
                min={-Infinity}
                max={Infinity}
                value={positionX}
                step={isMagnet ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP}
                onChange={(value) => onMove('x', value)}
            />

            <InfiniteSliderInput
                name="Положение Y"
                min={-Infinity}
                max={Infinity}
                value={positionY}
                step={isMagnet ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP}
                onChange={(value) => onMove('y', value)}
            />
        </>
    );
});
