'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useCanvasStore } from '@/canvas/store/сanvasStore';
import Sidebar from '@/components/UI/Sidebar';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import CanvasSidebarList from '@/canvas/components/CanvasSidebarList';
import Inspector from '@/canvas/components/Inspector';

import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { getNodes } from '@/canvas/utils/getNodes';
import { openInspector } from '@/canvas/utils/openInspector';

import { Plus, Home, Search } from 'lucide-react';

export default function CanvasSidebar() {
    const { items, setItems, inspectorItem, breadcrumbs } = useCanvasStore();
    const [filterText, setFilterText] = useState('');

    const nodes = getNodes(items);

    const handleBreadcrumbClick = (index: number) => {
        const { breadcrumbs, setBreadcrumbs, setInspectorItem } = useCanvasStore.getState();
        if (index === 0) setInspectorItem(null);
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    };

    return (
        <Sidebar>
            <Breadcrumbs items={breadcrumbs} onClick={handleBreadcrumbClick} />

            <hr className="border-b-0 border-[#1a1a1a]" />

            <div className="flex flex-col flex-1 overflow-y-auto">
                {breadcrumbs.length === 1 && !inspectorItem && (
                    <>
                        <div className="flex items-center gap-2 m-1">
                            <button
                                onClick={() => setItems([...items, handleAddNode(nodes)])}
                                className="w-fit bg-[#151515] hover:bg-[#1a1a1a] p-2 rounded-md transition cursor-pointer"
                            >
                                <Plus size={16} />
                            </button>

                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Поиск..."
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                    className="w-full h-8 bg-[#151515] text-white placeholder-[#888] pl-3 pr-9 text-sm rounded-md focus:outline-none"
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]" size={14} />
                            </div>
                        </div>
                        <hr className="border-b-0 border-[#1a1a1a]" />
                    </>
                )}

                {inspectorItem ? (
                    <Inspector item={inspectorItem} />
                ) : (
                    <CanvasSidebarList filterText={filterText} openInspectorForItem={openInspector} />
                )}
            </div>

            <hr className="border-b-0 border-[#1a1a1a]" />

            <div className="flex justify-end m-1">
                <Link href="/" className="w-fit bg-[#151515] hover:bg-[#1a1a1a] p-2 rounded-md transition cursor-pointer">
                    <Home size={16} />
                </Link>
            </div>
        </Sidebar>
    );
}
