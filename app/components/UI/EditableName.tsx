'use client';

import { useState, useEffect, memo } from 'react';

interface EditableNameProps {
    name: string;
    isSelected: boolean;
    onChange: (newName: string) => void;
}

export const EditableName = memo(function EditableName({ name, isSelected, onChange }: EditableNameProps) {
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
            className="bg-card border border-bg-accent rounded px-1 py-0.5 text-foreground text-sm outline-none w-full"
            onDoubleClick={(e) => e.stopPropagation()}
        />
    ) : (
        <span
            className={`text-sm cursor-pointer ${isSelected ? 'text-text-accent' : 'text-foreground'}`}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setEditing(true);
            }}
        >
            {name}
        </span>
    );
});
