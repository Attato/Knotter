'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import Sidebar from '@/components/UI/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';
import CanvasSidebarList from '@/canvas/components/CanvasSidebarList';
import Inspector from '@/canvas/components/Inspector';

import useVerticalResize from '@/canvas/hooks/useVerticalResize';

import { Home, Search } from 'lucide-react';

export default function CanvasSidebar() {
    const { items, inspectorItem, setInspectorItem } = useCanvasStore();

    const [filterText, setFilterText] = useState('');
    const topBlockRef = useRef<HTMLDivElement>(null);
    const [topOffset, setTopOffset] = useState(0);

    useLayoutEffect(() => {
        const updateTopOffset = () => {
            if (topBlockRef.current) {
                setTopOffset(topBlockRef.current.getBoundingClientRect().bottom);
            }
        };

        updateTopOffset();
        window.addEventListener('resize', updateTopOffset);
        return () => window.removeEventListener('resize', updateTopOffset);
    }, []);

    const { height: inspectorHeight, isResizing, startResize } = useVerticalResize(240, 120, topOffset);

    useEffect(() => {
        if (inspectorItem && !items.some((i) => i.id === inspectorItem.id)) {
            setInspectorItem(null);
        }
    }, [items, inspectorItem, setInspectorItem]);

    const TopBlock = () => (
        <div ref={topBlockRef} className="flex flex-col">
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
    );

    const InspectorBlock = () => (
        <div style={{ height: inspectorHeight }} className="overflow-y-auto bg-background-alt border-t border-border">
            {inspectorItem ? (
                items.some((i) => i.id === inspectorItem.id) ? (
                    <Inspector item={inspectorItem} />
                ) : null
            ) : (
                <div className="flex justify-center items-center h-full text-gray text-sm text-center">
                    Выберите элемент для инспектора
                </div>
            )}
        </div>
    );

    const BottomControls = () => (
        <div className="flex justify-between p-1 gap-2 h-[42px] border-t border-border">
            <ThemeToggle />

            <Link href="/" className="w-fit bg-card hover:bg-ui border border-border p-2 rounded-md cursor-pointer">
                <Home size={16} />
            </Link>
        </div>
    );

    return (
        <Sidebar>
            <div className="flex flex-col h-full relative">
                <TopBlock />

                <div className="flex flex-col flex-1 overflow-hidden">
                    <CanvasSidebarList filterText={filterText} />
                </div>

                <div
                    className={`h-1 ${isResizing ? 'bg-border-light' : 'hover:bg-border-light'} cursor-row-resize`}
                    onMouseDown={startResize}
                />

                <InspectorBlock />

                <BottomControls />
            </div>
        </Sidebar>
    );
}
