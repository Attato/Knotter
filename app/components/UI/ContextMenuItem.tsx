'use client';

import React from 'react';

interface ContextMenuItemProps {
    onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    disabled?: boolean;
    shortcut?: string;
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ onClick, children, disabled = false, shortcut }) => {
    return (
        <button
            className={`flex justify-between items-center px-3 py-1 hover:bg-[#1d1d1d] w-full text-left cursor-pointer ${disabled ? 'opacity-40' : ''}`}
            onClick={(e) => onClick?.(e)}
            disabled={disabled}
        >
            <span>{children}</span>
            {shortcut && (
                <span className={` ${disabled ? 'opacity-40' : 'text-[#999]'} ml-2 text-sm select-none`}>{shortcut}</span>
            )}
        </button>
    );
};
