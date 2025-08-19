'use client';

import { ReactNode } from 'react';
import { useCanvasStore } from './store/сanvasStore';
import { Node } from '@/canvas/canvas.types';

export default function CanvasLayout({ children }: { children: ReactNode }) {
    const { nodes, selectedNodeIds, setSelectedNodeIds } = useCanvasStore();

    const handleNodeClick = (nodeId: number, e: React.MouseEvent) => {
        if (e.ctrlKey || e.metaKey) {
            const newSelectedIds = selectedNodeIds.includes(nodeId)
                ? selectedNodeIds.filter((id) => id !== nodeId)
                : [...selectedNodeIds, nodeId];
            setSelectedNodeIds(newSelectedIds);
        } else {
            setSelectedNodeIds([nodeId]);
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <main className="flex-1">{children}</main>

            <aside className="w-120 border-l border-[#1a1a1a] flex flex-col bg-[#0f0f0f] select-none">
                {nodes.length === 0 ? (
                    <p className="px-4">-</p>
                ) : (
                    <ul className="flex-1 overflow-y-auto">
                        {nodes.map((node: Node) => {
                            const isSelected = selectedNodeIds.includes(node.id);
                            return (
                                <li
                                    key={node.id}
                                    onClick={(e) => handleNodeClick(node.id, e)}
                                    className={`px-4 py-2 m-1 rounded-md cursor-pointer ${isSelected ? 'bg-[#388bfd1a]' : 'hover:bg-[#1a1a1a]'}`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <span className={`${isSelected && 'text-[#4493f8]'}`}>Узел</span>
                                        <span className="text-[#ccc] text-[12px]">ID: {node.id}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </aside>
        </div>
    );
}
