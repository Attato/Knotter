'use client';

import { memo, useCallback, InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { MAX_INPUT_LENGTH } from '@/canvas/constants';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'maxLength'> {
    value: string;
    onChange: (value: string) => void;
    icon?: LucideIcon;
}

export const Input = memo(function Input({ value, onChange, icon: Icon, className = '', ...props }: InputProps) {
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

    const hasIcon = Boolean(Icon);

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={value}
                onChange={handleChange}
                className={`w-full bg-card text-foreground placeholder-gray px-3 py-1 text-sm rounded-md focus:outline-none ${
                    hasIcon ? 'pr-9' : ''
                } ${className}`}
                {...props}
            />
            {Icon && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray ">
                    <Icon size={16} />
                </div>
            )}
        </div>
    );
});
