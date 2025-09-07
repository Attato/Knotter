'use client';

import { useState } from 'react';
import Link from 'next/link';

import Sidebar from '@/components/UI/Sidebar';
import Breadcrumbs, { Breadcrumb } from '@/components/UI/Breadcrumbs';
import CanvasSidebarList from '@/canvas/components/CanvasSidebarList';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { getNodes } from '@/canvas/utils/getNodes';

import { Plus, Home, Search } from 'lucide-react';

export default function CanvasSidebar() {
    const { items, setItems } = useCanvasStore();
    const [filterText, setFilterText] = useState('');

    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ label: 'Untitled' }]);

    const nodes = getNodes(items);

    const handleAddNodeClick = () => {
        const newNode = handleAddNode(nodes);
        setItems([...items, newNode]);
    };

    const handleBreadcrumbClick = (index: number) => {
        setBreadcrumbs((prev) => prev.slice(0, index + 1));
    };

    return (
        <Sidebar>
            <Breadcrumbs items={breadcrumbs} onClick={handleBreadcrumbClick} />

            <hr className="border-b-0 border-[#1a1a1a]" />

            <div className="flex flex-col flex-1">
                {breadcrumbs.length === 1 && (
                    <>
                        <div className="flex items-center gap-2 m-1">
                            <button
                                onClick={handleAddNodeClick}
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

                <CanvasSidebarList filterText={filterText} />
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
