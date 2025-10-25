'use client';

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { ChevronDown } from 'lucide-react';

type DropdownProps = {
    title: string;
    children: React.ReactNode;
    light?: boolean;
};

export const DropdownAbsolute = memo(function DropdownAbsolute({ title, children, light = false }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                close();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [close]);

    const handleContentClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            close();
        },
        [close],
    );

    return (
        <div ref={dropdownRef} className="relative w-full">
            <button
                onClick={toggle}
                className={`flex justify-between items-center  px-3 py-2 w-full text-sm rounded-md cursor-pointer ${light ? 'bg-ui hover:bg-ui-hover' : 'bg-card hover:bg-ui'}`}
            >
                {title}
                <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
            </button>

            {isOpen && (
                <div
                    className={`absolute top-full left-0 flex flex-col gap-1 w-full text-sm shadow-md rounded-md mt-1 p-1 z-50 ${light ? 'bg-ui' : 'bg-card'}`}
                    onClick={handleContentClick}
                >
                    {children}
                </div>
            )}
        </div>
    );
});
