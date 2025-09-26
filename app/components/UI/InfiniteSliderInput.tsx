'use client';

import { useRef } from 'react';

type InfiniteSliderInputProps = {
    value: number;
    step?: number;
    onChange: (value: number) => void;
    label?: string;
};

export default function InfiniteSliderInput({ value, step = 1, onChange, label }: InfiniteSliderInputProps) {
    const draggingRef = useRef(false);
    const startXRef = useRef(0);
    const startValueRef = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        draggingRef.current = true;
        startXRef.current = e.clientX;
        startValueRef.current = value;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!draggingRef.current) return;
        const delta = e.clientX - startXRef.current;
        const newValue = startValueRef.current + delta * step;
        onChange(newValue);
    };

    const handleMouseUp = () => {
        draggingRef.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="flex gap-2 items-center select-none w-full">
            {label && <label className="text-sm font-medium">{label}</label>}

            <div
                onMouseDown={handleMouseDown}
                className="w-full bg-ui h-8 px-2 flex items-center cursor-ew-resize rounded select-none"
            >
                {Number.isInteger(value) ? value : value.toFixed(2)}
            </div>
        </div>
    );
}
