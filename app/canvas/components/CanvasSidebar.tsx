'use client';

import { useState } from 'react';

import Link from 'next/link';

import CanvasSidebarList from '@/canvas/components/CanvasSidebarList';

import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { handleAddNode } from '@/canvas/utils/handleAddNode';

import { Plus, Home, Search } from 'lucide-react';

export default function CanvasSidebar() {
    const { nodes, setNodes } = useCanvasStore();
    const [filterText, setFilterText] = useState('');

    const addNode = () => {
        const newNodes = handleAddNode(nodes);
        setNodes(newNodes);
    };

    return (
        <aside className={`h-screen w-120 border-l border-[#1a1a1a] bg-[#0f0f0f] select-none duration-300 ease-in-out`}>
            <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center gap-2 m-1">
                    <button
                        onClick={addNode}
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
                            className="w-full h-8 bg-[#151515] text-white placeholder-[#888] pl-3 pr-9 py-2 text-sm rounded-md focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]">
                            <Search size={14} />
                        </span>
                    </div>
                </div>

                <hr className="border-b-0 border-[#1a1a1a]" />

                <CanvasSidebarList filterText={filterText} />

                <hr className="border-b-0 border-[#1a1a1a]" />

                <div className="flex justify-end m-1">
                    <Link
                        href="/"
                        className="w-fit bg-[#151515] hover:bg-[#1a1a1a] p-2 rounded-md transition cursor-pointer"
                    >
                        <Home size={20} />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
