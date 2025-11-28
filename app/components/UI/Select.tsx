'use client';

import { memo, useState, useRef, useEffect } from 'react';

import { ChevronDown } from 'lucide-react';

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    className?: string;
}

export const Select = memo(function Select({ value, onChange, options, className = '' }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div ref={selectRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 h-8 bg-depth-3 hover:bg-depth-4 border border-depth-3 rounded-md text-sm focus:outline-none cursor-pointer ${className}`}
            >
                <span>{value}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-depth-3 border border-depth-3 rounded-md shadow-lg max-h-60 overflow-auto">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full px-3 py-2 text-sm text-left hover:bg-depth-5 cursor-pointer`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});
