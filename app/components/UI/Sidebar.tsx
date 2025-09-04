'use client';

import { ReactNode } from 'react';
import useSidebarResize from '@/hooks/useSidebarResize';

type SidebarProps = {
    minWidth?: number;
    baseWidth?: number;
    maxWidth?: number;
    children: ReactNode;
};

const SIDEBAR_MIN_WIDTH = 240;
const SIDEBAR_BASE_WIDTH = 480;
const SIDEBAR_MAX_WIDTH = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1600;

export default function Sidebar({
    minWidth = SIDEBAR_MIN_WIDTH,
    baseWidth = SIDEBAR_BASE_WIDTH,
    maxWidth = SIDEBAR_MAX_WIDTH,
    children,
}: SidebarProps) {
    const { width, isResizing, startResize } = useSidebarResize(minWidth, baseWidth, maxWidth);

    return (
        <aside style={{ width }} className="h-screen border-l border-[#1a1a1a] bg-[#0f0f0f] select-none flex-shrink-0 z-50">
            <div className="flex flex-col h-full overflow-hidden relative">
                {children}

                <div
                    onMouseDown={startResize}
                    className={`absolute top-0 left-0 h-full w-1 hover:cursor-ew-resize ${
                        isResizing ? 'bg-[#333]' : 'hover:bg-[#333]'
                    }`}
                />
            </div>
        </aside>
    );
}
