import { useState, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export default function useSidebarResize(minWidth: number, baseWidth: number, maxWidth: number, tabs: string[]) {
    const sidebarWidth = useCanvasStore((state) => state.sidebarWidth);
    const setSidebarWidth = useCanvasStore((state) => state.setSidebarWidth);
    const activeTab = useCanvasStore((state) => state.activeTab);
    const setActiveTab = useCanvasStore((state) => state.setActiveTab);

    const [isResizing, setIsResizing] = useState(false);
    const [open, setOpen] = useState(sidebarWidth > 0);

    const resizeRef = useRef(false);
    const currentWidthRef = useRef(sidebarWidth);

    const lastActiveTabRef = useRef(activeTab);

    const openSidebar = useCallback(
        (fromDrag = false) => {
            if (!activeTab && !lastActiveTabRef.current && tabs.length === 0) return;

            setOpen(true);

            if (!fromDrag && sidebarWidth === 0) {
                setSidebarWidth(baseWidth);
                currentWidthRef.current = baseWidth;
            }

            if (!activeTab) {
                if (lastActiveTabRef.current) {
                    setActiveTab(lastActiveTabRef.current);
                } else if (tabs.length > 0) {
                    setActiveTab(tabs[0]);
                }
            }
        },
        [activeTab, baseWidth, setActiveTab, setSidebarWidth, sidebarWidth, tabs],
    );

    const closeSidebar = useCallback(() => {
        setOpen(false);

        if (activeTab) lastActiveTabRef.current = activeTab;

        setSidebarWidth(0);
        setActiveTab(null);
    }, [activeTab, setActiveTab, setSidebarWidth]);

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!open && !activeTab && !lastActiveTabRef.current && tabs.length === 0) return;

        if (!open) openSidebar(true);

        const startX = e.clientX;
        const startWidth = sidebarWidth;

        resizeRef.current = true;
        setIsResizing(true);
        document.documentElement.classList.add('resizing');

        const handleMouseMove = (e: MouseEvent) => {
            if (!resizeRef.current) return;

            const delta = startX - e.clientX;
            let newWidth = startWidth + delta;

            if (newWidth > maxWidth) newWidth = maxWidth;
            if (newWidth < 0) newWidth = 0;

            currentWidthRef.current = newWidth;
            setSidebarWidth(newWidth);

            if (newWidth <= minWidth && open) {
                closeSidebar();
                resizeRef.current = false;
            }
        };

        const handleMouseUp = () => {
            resizeRef.current = false;
            setIsResizing(false);
            document.documentElement.classList.remove('resizing');

            if (currentWidthRef.current <= minWidth) closeSidebar();

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return {
        width: Math.max(sidebarWidth, 1),
        isResizing,
        startResize,
        open,
        openSidebar,
        closeSidebar,
    };
}
