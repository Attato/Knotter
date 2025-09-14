'use client';

import React, { FC, ReactNode, MouseEvent } from 'react';

interface ContextMenuItemProps {
    onClick: (e?: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    disabled?: boolean;
    shortcut?: string;
}

export const ContextMenuItem: FC<ContextMenuItemProps> = ({ onClick, children, disabled = false, shortcut }) => {
    return (
        <button
            className={`flex justify-between items-center px-3 py-1 bg-card hover:bg-ui w-full text-left cursor-pointer ${disabled ? 'opacity-40' : ''}`}
            onClick={(e) => onClick?.(e)}
            disabled={disabled}
        >
            <span>{children}</span>

            {shortcut && (
                <span className={` ${disabled ? 'opacity-40' : 'text-gray'} ml-2 text-xs select-none`}>{shortcut}</span>
            )}
        </button>
    );
};
