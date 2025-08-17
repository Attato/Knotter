'use client';

import React from 'react';

interface ContextMenuItemProps {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ onClick, children, disabled = false }) => {
    return (
        <button
            className={`block px-3 py-1 hover:bg-[#1d1d1d] w-full text-left cursor-pointer ${disabled && 'text-[#6c6c6c]'}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
