'use client';

import { memo } from 'react';
import { useCanvasSidebar } from '@/canvas/hooks/useCanvasSidebar';

import { Sidebar } from '@/components/UI/Sidebar';
import { CanvasSidebarList } from '@/canvas/components/CanvasSidebar/CanvasSidebarList';
import { Inspector } from '@/canvas/components/Inspector/Inspector';

import { Search } from 'lucide-react';

export const CanvasSidebar = memo(function CanvasSidebar() {
    const { filterText, setFilterText, topBlockRef, inspectorHeight, isResizing, startResize } = useCanvasSidebar();

    return (
        <Sidebar>
            <div className="flex flex-col h-full relative">
                <div ref={topBlockRef}>
                    <div className="flex items-center gap-2 m-1">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Поиск..."
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                className="w-full h-8 bg-card text-foreground placeholder-gray pl-3 pr-9 text-sm rounded-md focus:outline-none"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray" size={14} />
                        </div>
                    </div>
                    <hr className="border-b-0 border-border" />
                </div>

                <div className="flex flex-col flex-1 overflow-hidden">
                    <CanvasSidebarList filterText={filterText} />
                </div>

                <div
                    className={`h-1 ${isResizing ? 'bg-border-light' : 'hover:bg-border-light'} cursor-row-resize`}
                    onMouseDown={startResize}
                />

                <div style={{ height: inspectorHeight }} className="bg-background-alt border-t border-border">
                    <Inspector />
                </div>
            </div>
        </Sidebar>
    );
});
