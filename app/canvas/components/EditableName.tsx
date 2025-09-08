'use client';

import { useState, useEffect } from 'react';

interface EditableNameProps {
    name: string;
    isSelected: boolean;
    onChange: (newName: string) => void;
}

export function EditableName({ name, isSelected, onChange }: EditableNameProps) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(name);

    useEffect(() => {
        setValue(name);
    }, [name]);

    const finishEditing = () => {
        setEditing(false);
        onChange(value.trim() || name);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') finishEditing();
        if (e.key === 'Escape') {
            setEditing(false);
            setValue(name);
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F2' && isSelected) {
                e.preventDefault();
                setEditing(true);
            }
        };
        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, [isSelected]);

    return editing ? (
        <input
            type="text"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleInputKeyDown}
            className="bg-[#1a1a1a] border border-[#388bfd] rounded px-1 py-0.5 text-[#fff] text-sm outline-none w-full transition-all"
            onDoubleClick={(e) => e.stopPropagation()}
        />
    ) : (
        <span
            className={`text-sm cursor-pointer transition-colors ${isSelected ? 'text-[#388bfd]' : 'text-[#fff]'}`}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setEditing(true);
            }}
        >
            {name}
        </span>
    );
}
