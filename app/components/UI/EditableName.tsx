'use client';

import { useState, useEffect, memo } from 'react';

interface EditableNameProps {
    name: string;
    onChange: (newName: string) => void;
    isSelected?: boolean;
    className?: string;
    maxWidth?: string;
    maxLength?: number;
}

export const EditableName = memo(function EditableName({
    name,
    onChange,
    isSelected = false,
    className = '',
    maxLength = 25,
}: EditableNameProps) {
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
            className="bg-card border border-bg-accent rounded px-1 text-foreground text-sm outline-none w-full tabular-nums"
            onDoubleClick={(e) => e.stopPropagation()}
            maxLength={maxLength}
        />
    ) : (
        <span
            className={`block px-[5px] py-[1px] text-sm cursor-pointer text-left overflow-hidden text-ellipsis whitespace-nowrap tabular-nums ${isSelected ? 'text-text-accent' : 'text-foreground'} ${className}`}
            style={{
                minWidth: 0,
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setEditing(true);
            }}
        >
            {name}
        </span>
    );
});
