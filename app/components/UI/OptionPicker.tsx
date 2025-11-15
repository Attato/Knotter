'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from './Input';

interface OptionPickerOption {
    value: string;
    label: string;
    icon?: React.ComponentType<{ size?: number }>;
}

interface OptionPickerProps {
    options: OptionPickerOption[];
    onSelect: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const OptionPicker = memo(function OptionPicker({
    options,
    onSelect,
    placeholder = 'Выберите...',
    className = '',
}: OptionPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div ref={pickerRef} className={`relative w-full ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 h-8 bg-card hover:bg-border border border-border rounded-md text-sm"
            >
                <span>{placeholder}</span>

                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-64 overflow-auto flex flex-col">
                    <Input
                        value={query}
                        onChange={(value) => setQuery(value)}
                        icon={Search}
                        iconSize={14}
                        placeholder="Поиск..."
                        className="bg-border m-1"
                    />

                    <hr className="border-b-0 border-border" />

                    <div className="flex flex-col gap-1 m-1">
                        {filtered.map((opt) => {
                            const Icon = opt.icon;

                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className="flex items-center gap-2 px-3 py-2 bg-border hover:bg-ui text-left text-sm rounded-md"
                                >
                                    {Icon && <Icon size={16} />}
                                    {opt.label}
                                </button>
                            );
                        })}

                        {filtered.length === 0 && (
                            <div className="text-gray text-center text-sm py-2">Ничего не найдено</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});
