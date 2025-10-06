'use client';

import React, { forwardRef, memo } from 'react';

interface ContextMenuProps {
    isOpen: boolean;
    position: { x: number; y: number };
    onClose: () => void;
    children: React.ReactNode;
}

export const ContextMenu = memo(
    forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu({ isOpen, position, children }, ref) {
        if (!isOpen) return null;

        return (
            <div
                ref={ref}
                className="min-w-56 absolute bg-card border border-border-light text-foreground rounded shadow-md py-1 text-sm z-50"
                style={{ top: position.y, left: position.x }}
            >
                {children}
            </div>
        );
    }),
);
