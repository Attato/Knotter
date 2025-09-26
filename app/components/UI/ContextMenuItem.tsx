'use client';

import React, { FC, ReactNode, MouseEvent, useState } from 'react';
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

export const ContextMenuItem: FC<ContextMenuItemProps> = ({
    onClick,
    children,
    disabled = false,
    shortcut,
    submenu,
    icon: Icon,
}) => {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

    return (
        <div className="relative" onMouseEnter={() => setIsSubmenuOpen(true)} onMouseLeave={() => setIsSubmenuOpen(false)}>
            <button
                className={`flex justify-between items-center px-3 py-1 bg-card hover:bg-ui w-full text-left cursor-pointer ${
                    disabled ? 'opacity-40 cursor-not-allowed' : ''
                }`}
                onClick={(e) => !submenu && onClick?.(e)}
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

            {submenu && isSubmenuOpen && (
                <div className="absolute top-0 left-full min-w-40 w-full bg-card border border-border-light rounded shadow-md py-1 text-sm z-50">
                    {submenu}
                </div>
            )}
        </div>
    );
};
