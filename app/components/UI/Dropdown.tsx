'use client';

import { memo, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

type DropdownProps = {
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
    onRename?: (newTitle: string) => void;
};

export const Dropdown = memo(function Dropdown({ title, children, disabled = false, onRename }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

    const toggle = useCallback(() => {
        if (!disabled && !isEditing) setIsOpen((prev) => !prev);
    }, [disabled, isEditing]);

    const handleRenameStart = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();

            if (!disabled && onRename) {
                setIsEditing(true);
                setEditedTitle(title);
            }
        },
        [disabled, onRename, title],
    );

    const handleRenameSave = useCallback(() => {
        setIsEditing(false);

        if (onRename && editedTitle.trim() !== '') {
            onRename(editedTitle.trim());
        } else {
            setEditedTitle(title);
        }
    }, [onRename, editedTitle, title]);

    const handleRenameCancel = useCallback(() => {
        setIsEditing(false);
        setEditedTitle(title);
    }, [title]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleRenameSave();
            } else if (e.key === 'Escape') {
                handleRenameCancel();
            }
        },
        [handleRenameSave, handleRenameCancel],
    );

    return (
        <div className={`flex flex-col gap-1 rounded-md bg-card w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                onClick={toggle}
                disabled={disabled}
                className={`flex justify-start gap-2 items-center px-3 py-2 w-full text-sm transition-colors  ${
                    disabled ? 'cursor-not-allowed text-gray' : 'cursor-pointer hover:bg-ui'
                } ${isOpen ? 'rounded-t-md' : 'rounded-md'}`}
            >
                <ChevronDown className={`transition-transform ${isOpen && !disabled ? 'rotate-180' : ''}`} size={16} />

                {isEditing && onRename ? (
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleRenameSave}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="bg-card border border-bg-accent rounded px-1 py-0.5 text-foreground text-sm outline-none w-full"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span
                        className="flex-1 text-left"
                        onDoubleClick={handleRenameStart}
                        style={{ cursor: onRename ? 'text' : 'default' }}
                    >
                        {title}
                    </span>
                )}
            </button>

            {isOpen && !disabled && <div className="flex flex-col gap-1 px-3 pb-2">{children}</div>}
        </div>
    );
});
