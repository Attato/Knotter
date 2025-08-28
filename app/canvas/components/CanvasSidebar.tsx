'use client';

import { useState } from 'react';

import Link from 'next/link';

import CanvasSidebarList from '@/canvas/components/CanvasSidebarList';

import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { handleAddNode } from '@/canvas/utils/handleAddNode';

import { PanelRight, Plus, Home } from 'lucide-react';

export default function CanvasSidebar() {
    const { nodes, setNodes } = useCanvasStore();
    const [isOpen, setIsOpen] = useState(false);

    const addNode = () => {
        const newNodes = handleAddNode(nodes);
        setNodes(newNodes);
    };

    return (
        <aside
            className={`absolute top-0 right-0 h-full w-120 border-l border-[#1a1a1a] bg-[#0f0f0f] select-none transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -left-[38px] top-4 z-20 border border-r-0 border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] text-white p-2 rounded-l-lg shadow-md transition-all cursor-pointer"
            >
                <PanelRight size={20} />
            </button>

            <div className="flex flex-col h-full overflow-hidden">
                <div className="m-1">
                    <button
                        onClick={addNode}
                        className="w-fit bg-[#151515] hover:bg-[#1a1a1a] p-2 rounded-md transition cursor-pointer"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <hr className="border-b-0 border-[#1a1a1a]" />

                <CanvasSidebarList />

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
