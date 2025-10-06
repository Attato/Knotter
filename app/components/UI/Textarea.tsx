'use client';

import { memo, useCallback } from 'react';
import { TextareaHTMLAttributes } from 'react';
import { MAX_TEXTAREA_LENGTH } from '@/canvas/constants';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'maxLength'> {
    value: string;
    onChange: (value: string) => void;
}

export const Textarea = memo(function Textarea({ value, onChange, className = '', ...props }: TextareaProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            let newValue = e.target.value;
            if (MAX_TEXTAREA_LENGTH && newValue.length > MAX_TEXTAREA_LENGTH) {
                newValue = newValue.slice(0, MAX_TEXTAREA_LENGTH);
            }
            onChange(newValue);
        },
        [onChange],
    );

    return (
        <div className="flex flex-col gap-1 w-full">
            <textarea
                value={value}
                onChange={handleChange}
                className={`flex items-center w-full bg-card text-foreground placeholder-gray px-3 py-2 text-sm rounded-md focus:outline-none resize-none field-sizing-content min-h-[3lh] max-h-[12lh] ${className}`}
                {...props}
            />
        </div>
    );
});
