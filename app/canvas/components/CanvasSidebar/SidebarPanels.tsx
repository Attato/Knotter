'use client';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import type { Tab } from '@/canvas/components/CanvasSidebar/CanvasSidebar';

interface SidebarPanelsProps {
    tabs: Tab[];
}

export function SidebarPanels({ tabs }: SidebarPanelsProps) {
    const activeTab = useCanvasStore((s) => s.activeTab);

    const panel = tabs.find((t) => t.id === activeTab)?.content;

    return <div className="flex-1 overflow-auto bg-depth-1 border-r border-depth-3">{panel}</div>;
}
