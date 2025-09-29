'use client';

import { InputHTMLAttributes } from 'react';
import { MAX_INPUT_LENGTH } from '@/canvas/constants';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'maxLength'> {
    value: string;
    onChange: (value: string) => void;
}

export default function Input({ value, onChange, className = '', ...props }: InputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        if (MAX_INPUT_LENGTH && newValue.length > MAX_INPUT_LENGTH) {
            newValue = newValue.slice(0, MAX_INPUT_LENGTH);
        }

        onChange(newValue);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={value}
                onChange={handleChange}
                className={`w-full py-2 bg-card text-foreground placeholder-gray px-3 text-sm rounded-md focus:outline-none pr-12 ${className}`}
                {...props}
            />
        </div>
    );
}
