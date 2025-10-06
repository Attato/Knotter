'use client';

import { memo } from 'react';
import { NODE_MOVE_MIN_STEP } from '@/canvas/constants';
import { InfiniteSliderInput } from '@/components/UI/InfiniteSliderInput';

interface PositionInputsProps {
    positionX: number;
    positionY: number;
    onMove: (axis: 'x' | 'y', value: number) => void;
}

export const PositionInputs = memo(function PositionInputs({ positionX, positionY, onMove }: PositionInputsProps) {
    return (
        <>
            <InfiniteSliderInput
                label="Положение X"
                value={positionX}
                step={NODE_MOVE_MIN_STEP}
                onChange={(v) => onMove('x', v)}
            />
            <InfiniteSliderInput
                label="Положение Y"
                value={positionY}
                step={NODE_MOVE_MIN_STEP}
                onChange={(v) => onMove('y', v)}
            />
        </>
    );
});
