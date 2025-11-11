'use client';

import React, { ReactNode, MouseEvent, memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ContextMenuItemProps {
    onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    disabled?: boolean;
    shortcut?: string;
    submenu?: ReactNode;
    icon?: LucideIcon;
}

export const ContextMenuItem = memo(function ContextMenuItem({
    onClick,
    children,
    disabled = false,
    shortcut,
    submenu,
    icon: Icon,
}: ContextMenuItemProps) {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (submenu) {
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    return (
        <div className="relative group">
            <button
                className={`flex justify-between items-center px-3 py-1 bg-card hover:bg-border w-full text-left cursor-pointer ${
                    disabled ? 'opacity-40 cursor-not-allowed' : ''
                }`}
                onClick={handleClick}
                disabled={disabled}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{children}</span>
                </div>

                <div className="flex items-center gap-2">
                    {shortcut && (
                        <span className={`${disabled ? 'opacity-40' : 'text-gray'} ml-2 text-xs select-none`}>
                            {shortcut}
                        </span>
                    )}
                    {submenu && (
                        <span className="ml-2 text-gray text-xs select-none">
                            <ChevronRight size={16} />
                        </span>
                    )}
                </div>
            </button>

            {submenu && !disabled && (
                <div className="absolute top-0 left-full min-w-40 w-full bg-card border border-border-light rounded shadow-md py-1 text-sm z-50 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity">
                    {submenu}
                </div>
            )}
        </div>
    );
});
