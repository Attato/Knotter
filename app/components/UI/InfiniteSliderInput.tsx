'use client';

import { memo, useRef, useCallback } from 'react';

type InfiniteSliderInputProps = {
    value: number;
    step?: number;
    onChange: (value: number) => void;
    label?: string;
};

export const InfiniteSliderInput = memo(function InfiniteSliderInput({
    value,
    step = 1,
    onChange,
    label,
}: InfiniteSliderInputProps) {
    const draggingRef = useRef(false);
    const startXRef = useRef(0);
    const startValueRef = useRef(0);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!draggingRef.current) return;
            const delta = e.clientX - startXRef.current;
            const newValue = startValueRef.current + delta * step;
            onChange(newValue);
        },
        [onChange, step],
    );

    const handleMouseUp = useCallback(() => {
        draggingRef.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            draggingRef.current = true;
            startXRef.current = e.clientX;
            startValueRef.current = value;

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        },
        [handleMouseMove, handleMouseUp, value],
    );

    return (
        <div className="flex justify-end gap-2 items-center select-none w-full">
            {label && <label className="text-sm font-medium w-full text-right text-nowrap">{label}</label>}

            <div
                onMouseDown={handleMouseDown}
                className="w-full bg-ui h-8 px-2 flex items-center cursor-ew-resize text-sm rounded-md select-none"
            >
                {Number.isInteger(value) ? value : value.toFixed(2)}
            </div>
        </div>
    );
});
