'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { CanvasItem } from '@/canvas/canvas.types';

import Sidebar from '@/components/UI/Sidebar';
import Breadcrumbs, { Breadcrumb } from '@/components/UI/Breadcrumbs';

import CanvasSidebarList from '@/canvas/components/CanvasSidebarList';
import Inspector from '@/canvas/components/Inspector';

import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { getNodes } from '@/canvas/utils/getNodes';

import { Plus, Home, Search } from 'lucide-react';

export default function CanvasSidebar() {
    const { items, setItems } = useCanvasStore();
    const [filterText, setFilterText] = useState('');
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ label: 'Канвас' }]);
    const [inspectorItem, setInspectorItem] = useState<CanvasItem | null>(null);

    const nodes = getNodes(items);

    const handleAddNodeClick = () => {
        const newNode = handleAddNode(nodes);
        setItems([...items, newNode]);
    };

    const handleBreadcrumbClick = (index: number) => {
        setBreadcrumbs((prev) => {
            if (index === 0) setInspectorItem(null);
            return prev.slice(0, index + 1);
        });
    };

    const handleItemDoubleClick = (item: CanvasItem) => {
        setBreadcrumbs([{ label: 'Канвас' }, { label: item.name }]);
        setInspectorItem(item);
    };

    const handleNameChange = (newName: string) => {
        if (!inspectorItem) return;

        const updatedItems = items.map((i) => (i.id === inspectorItem.id ? { ...i, name: newName } : i));
        setItems(updatedItems);

        setBreadcrumbs([{ label: 'Канвас' }, { label: newName }]);
    };

    return (
        <Sidebar>
            <Breadcrumbs items={breadcrumbs} onClick={handleBreadcrumbClick} />

            <hr className="border-b-0 border-[#1a1a1a]" />

            <div className="flex flex-col flex-1">
                {breadcrumbs.length === 1 && !inspectorItem && (
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

                {inspectorItem ? (
                    <Inspector item={inspectorItem} onNameChange={handleNameChange} />
                ) : (
                    <CanvasSidebarList filterText={filterText} onItemDoubleClick={handleItemDoubleClick} />
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
