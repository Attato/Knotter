'use client';

import { memo, useCallback, InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const Checkbox = memo(function Checkbox({ checked, onChange, className = '', ...props }: CheckboxProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.checked);
        },
        [onChange],
    );

    return (
        <label className="relative w-fit cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                className={`sr-only peer ${className}`}
                {...props}
            />
            <div className="w-5 h-5 bg-ui rounded-sm peer-focus:ring-2 peer-focus:ring-bg-accent peer-checked:bg-bg-accent peer-checked:border-bg-accent flex items-center justify-center">
                {checked && <Check size={16} className="text-white" />}
            </div>
        </label>
    );
});
