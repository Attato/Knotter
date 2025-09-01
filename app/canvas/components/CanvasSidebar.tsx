'use client';

import { useState, useRef } from 'react';

import Link from 'next/link';

import CanvasSidebarList from '@/canvas/components/CanvasSidebarList';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { handleAddNode } from '@/canvas/utils/handleAddNode';

import { Plus, Home, Search } from 'lucide-react';

const SIDEBAR_MIN_WIDTH = 320;
const SIDEBAR_BASE_WIDTH = 480;

export default function CanvasSidebar() {
    const { nodes, setNodes } = useCanvasStore();
    const [filterText, setFilterText] = useState('');
    const [width, setWidth] = useState(SIDEBAR_BASE_WIDTH);
    const isResizing = useRef(false);

    const addNode = () => {
        const newNodes = handleAddNode(nodes);
        setNodes(newNodes);
    };

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizing.current = true;

        const handleMouseMove = (e: MouseEvent) => {
            if (isResizing.current) {
                const newWidth = Math.max(SIDEBAR_MIN_WIDTH, window.innerWidth - e.clientX);
                setWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            isResizing.current = false;

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

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
                        <Home size={16} />
                    </Link>
                </div>

                <div
                    onMouseDown={startResize}
                    className="absolute top-0 left-0 h-full w-1 cursor-ew-resize hover:bg-[#333]"
                />
            </div>
        </aside>
    );
}
