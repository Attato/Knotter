'use client';

import { ReactNode, memo } from 'react';
import useSidebarResize from '@/hooks/useSidebarResize';

type SidebarProps = {
    minWidth?: number;
    baseWidth?: number;
    maxWidth?: number;
    children: ReactNode;
};

const SIDEBAR_MIN_WIDTH = 12;
const SIDEBAR_BASE_WIDTH = 14;
const SIDEBAR_MAX_WIDTH = 80;

export const Sidebar = memo(function Sidebar({
    minWidth = SIDEBAR_MIN_WIDTH,
    baseWidth = SIDEBAR_BASE_WIDTH,
    maxWidth = SIDEBAR_MAX_WIDTH,
    children,
}: SidebarProps) {
    const { width, isResizing, startResize } = useSidebarResize(minWidth, baseWidth, maxWidth);

    return (
        <aside
            style={{ width: `${width}vw` }}
            className="h-screen border-l border-border bg-background-alt select-none flex-shrink-0 z-50"
        >
            <div className="flex flex-col h-full overflow-hidden relative">
                {children}

                <div
                    onMouseDown={startResize}
                    className={`absolute top-0 left-0 h-full w-1 hover:cursor-ew-resize ${
                        isResizing ? 'bg-border-light' : 'hover:bg-border-light'
                    }`}
                />
            </div>
        </aside>
    );
});
