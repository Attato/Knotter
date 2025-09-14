'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import Sidebar from '@/components/UI/Sidebar';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import ThemeToggle from '@/components/ThemeToggle';

import CanvasSidebarList from '@/canvas/components/CanvasSidebarList';
import Inspector from '@/canvas/components/Inspector';

import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { getNodes } from '@/canvas/utils/getNodes';
import { openInspector } from '@/canvas/utils/openInspector';

import { Plus, Home, Search } from 'lucide-react';

export default function CanvasSidebar() {
    const { items, setItems, inspectorItem, setInspectorItem, setBreadcrumbs, breadcrumbs } = useCanvasStore();
    const [filterText, setFilterText] = useState('');

    const nodes = getNodes(items);

    const handleBreadcrumbClick = (index: number) => {
        if (index === 0) setInspectorItem(null);

        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    };

    useEffect(() => {
        if (inspectorItem && !items.some((i) => i.id === inspectorItem.id)) {
            setInspectorItem(null);
            setBreadcrumbs(breadcrumbs.slice(0, 1));
        }
    }, [items, inspectorItem, setInspectorItem, breadcrumbs, setBreadcrumbs]);

    return (
        <Sidebar>
            <Breadcrumbs items={breadcrumbs} onClick={handleBreadcrumbClick} />

            <hr className="border-b-0 border-border" />

            <div className="flex flex-col flex-1 overflow-y-auto">
                {breadcrumbs.length === 1 && !inspectorItem && (
                    <>
                        <div className="flex items-center gap-2 m-1">
                            <button
                                onClick={() => setItems([...items, handleAddNode(nodes)])}
                                className="w-fit bg-card hover:bg-ui p-2 rounded-md cursor-pointer"
                            >
                                <Plus size={16} />
                            </button>

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
                    </>
                )}

                {inspectorItem ? (
                    items.some((i) => i.id === inspectorItem.id) ? (
                        <Inspector item={inspectorItem} />
                    ) : (
                        <CanvasSidebarList filterText={filterText} openInspectorForItem={openInspector} />
                    )
                ) : (
                    <CanvasSidebarList filterText={filterText} openInspectorForItem={openInspector} />
                )}
            </div>

            <hr className="border-b-0 border-border" />

            <div className="flex justify-between m-1 gap-2">
                <ThemeToggle />

                <Link href="/" className="w-fit bg-card hover:bg-ui border border-border p-2 rounded-md cursor-pointer">
                    <Home size={16} />
                </Link>
            </div>
        </Sidebar>
    );
}
