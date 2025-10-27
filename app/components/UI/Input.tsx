'use client';

import { memo, useCallback, InputHTMLAttributes } from 'react';
import { MAX_INPUT_LENGTH } from '@/canvas/constants';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'maxLength'> {
    value: string;
    onChange: (value: string) => void;
}

export const Input = memo(function Input({ value, onChange, className = '', ...props }: InputProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            let newValue = e.target.value;
            if (MAX_INPUT_LENGTH && newValue.length > MAX_INPUT_LENGTH) {
                newValue = newValue.slice(0, MAX_INPUT_LENGTH);
            }
            onChange(newValue);
        },
        [onChange],
    );

    return (
        <input
            type="text"
            value={value}
            onChange={handleChange}
            className={`w-full h-8 bg-card text-foreground placeholder-gray px-3 text-sm rounded-md focus:outline-none ${className}`}
            {...props}
        />
    );
});
