import { ReactNode, memo, useEffect } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import useSidebarResize from '@/hooks/useSidebarResize';
import { Tab } from '@/canvas/components/CanvasSidebar/CanvasSidebar';

type SidebarProps = {
    minWidth?: number;
    baseWidth?: number;
    maxWidth?: number;
    tabs: Tab[];
    children: ReactNode;
};

const SIDEBAR_MIN_WIDTH = 220;
const SIDEBAR_BASE_WIDTH = 420;
const SIDEBAR_MAX_WIDTH = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1600;

export const Sidebar = memo(function Sidebar({
    minWidth = SIDEBAR_MIN_WIDTH,
    baseWidth = SIDEBAR_BASE_WIDTH,
    maxWidth = SIDEBAR_MAX_WIDTH,
    tabs,
    children,
}: SidebarProps) {
    const activeTab = useCanvasStore((state) => state.activeTab);

    const { width, isResizing, startResize, open, openSidebar, closeSidebar } = useSidebarResize(
        minWidth,
        baseWidth,
        maxWidth,
        tabs.map((t) => t.id),
    );

    useEffect(() => {
        if (activeTab !== null && !open) {
            openSidebar();
        } else if (activeTab === null && open) {
            closeSidebar();
        }
    }, [activeTab, open, openSidebar, closeSidebar]);

    return (
        <aside
            style={{ width: `${width}px` }}
            className={`h-screen border-l border-border bg-background-alt select-none flex-shrink-0 z-50 relative ${
                !isResizing ? 'transition-width duration-200 ease-in-out' : ''
            }`}
        >
            <div className="flex flex-col h-full overflow-hidden relative">{children}</div>

            <div
                onMouseDown={startResize}
                className={`absolute top-0 left-0 h-full w-1 hover:cursor-ew-resize z-50 ${
                    isResizing ? 'bg-border-light' : 'hover:bg-border-light'
                }`}
            />
        </aside>
    );
});
