'use client';

import { useEffect, useRef, RefObject } from 'react';
import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';

import { MenuItem, useCanvasMenuItems } from '@/canvas/hooks/useCanvasMenuItems';

type CanvasContextMenuProps = {
    isOpen: boolean;
    position: { x: number; y: number };
    closeMenu: () => void;
    canvasRef?: RefObject<HTMLCanvasElement | null>;
};

export function CanvasContextMenu({ isOpen, position, closeMenu }: CanvasContextMenuProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { menuItems, offset } = useCanvasMenuItems();

    useEffect(() => {
        if (offset.x || offset.y) {
            closeMenu();
        }
    }, [offset.x, offset.y, closeMenu]);

    const renderMenuItem = (item: MenuItem, close: () => void, key: number) => {
        if (item.type === 'divider') return <hr key={key} className="border-b-0 border-border-light my-1" />;

        return (
            <ContextMenuItem
                key={key}
                onClick={() => {
                    item.onClick?.();
                    close();
                }}
                disabled={item.disabled}
                shortcut={item.shortcut}
                submenu={item.submenu?.map((sub, subIdx) => renderMenuItem(sub, close, subIdx))}
            >
                {item.label}
            </ContextMenuItem>
        );
    };

    return (
        <ContextMenu isOpen={isOpen} position={position} onClose={closeMenu} ref={menuRef}>
            {menuItems.map((item, idx) => renderMenuItem(item, closeMenu, idx))}
        </ContextMenu>
    );
}
