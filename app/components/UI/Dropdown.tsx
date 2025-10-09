'use client';

import { memo, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

type DropdownProps = {
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
};

export const Dropdown = memo(function Dropdown({ title, children, disabled = false }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => {
        if (!disabled) setIsOpen((prev) => !prev);
    }, [disabled]);

    return (
        <div className={`flex flex-col gap-1 rounded-md bg-card ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                onClick={toggle}
                disabled={disabled}
                className={`flex justify-start gap-2 items-center px-3 py-2 w-full text-sm transition-colors  ${
                    disabled ? 'cursor-not-allowed text-gray' : 'cursor-pointer hover:bg-ui'
                } ${isOpen ? 'rounded-t-md' : 'rounded-md'}`}
            >
                <ChevronDown className={`transition-transform ${isOpen && !disabled ? 'rotate-180' : ''}`} size={16} />
                {title}
            </button>

            {isOpen && !disabled && <div className="flex flex-col gap-1 px-3 pb-2">{children}</div>}
        </div>
    );
});
