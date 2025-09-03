'use client';

import { useState } from 'react';

import Link from 'next/link';

import CanvasSidebarList from '@/canvas/components/CanvasSidebarList';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { handleAddNode } from '@/canvas/utils/handleAddNode';

import useSidebarResize from '@/canvas/hooks/useSidebarResize';

import { Plus, Home, Search } from 'lucide-react';

const SIDEBAR_MIN_WIDTH = 240;
const SIDEBAR_BASE_WIDTH = 480;
const SIDEBAR_MAX_WIDTH = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1600;

export default function CanvasSidebar() {
    const { nodes, setNodes } = useCanvasStore();
    const [filterText, setFilterText] = useState('');
    const { width, isResizing, startResize } = useSidebarResize(SIDEBAR_MIN_WIDTH, SIDEBAR_BASE_WIDTH, SIDEBAR_MAX_WIDTH);

    const addNode = () => setNodes(handleAddNode(nodes));

    return (
        <aside style={{ width }} className="h-screen border-l border-[#1a1a1a] bg-[#0f0f0f] select-none flex-shrink-0">
            <div className="flex flex-col h-full overflow-hidden relative">
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
                            className="w-full h-8 bg-[#151515] text-white placeholder-[#888] pl-3 pr-9 text-sm rounded-md focus:outline-none"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]" size={14} />
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
                        <Home size={16} />
                    </Link>
                </div>

                <div
                    onMouseDown={startResize}
                    className={`absolute top-0 left-0 h-full w-1 hover:cursor-ew-resize ${
                        isResizing ? 'bg-[#333]' : 'hover:bg-[#333]'
                    }`}
                />
            </div>
        </aside>
    );
}
