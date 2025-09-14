'use client';

import React from 'react';

interface ContextMenuProps {
    isOpen: boolean;
    position: { x: number; y: number };
    onClose: () => void;
    children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ isOpen, position, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="min-w-56 absolute bg-card border border-border-light text-foreground rounded shadow-md py-1 text-sm z-50"
            style={{ top: position.y, left: position.x }}
        >
            {children}
        </div>
    );
};
