'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Node, Edge } from '@/canvas/canvas.types';

import { EditableName } from '@/canvas/components/EditableName';

import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { updateNodeSelection } from '@/canvas/utils/updateNodeSelection';
import { handleAddNode } from '@/canvas/utils/handleAddNode';

import { PanelRight, Plus, Home } from 'lucide-react';

export default function CanvasSidebar() {
    const { nodes, edges, selectedNodeIds, setSelectedNodeIds, setNodes } = useCanvasStore();
    const [isOpen, setIsOpen] = useState(false);

    const handleNodeClick = (nodeId: number, e: React.MouseEvent) => {
        const newSelectedIds = updateNodeSelection(nodes, selectedNodeIds, nodeId, e);
        setSelectedNodeIds(newSelectedIds);
    };

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

                <ul className="flex-1 overflow-y-auto">
                    {nodes.map((node: Node) => {
                        const isSelected = selectedNodeIds.includes(node.id);
                        const nodeEdges = edges.filter((edge: Edge) => edge.from === node.id || edge.to === node.id);

                        return (
                            <li
                                key={node.id}
                                onClick={(e) => handleNodeClick(node.id, e)}
                                className={`px-4 py-2 m-1 rounded-md cursor-pointer tabular-nums ${
                                    isSelected ? 'bg-[#388bfd1a]' : 'bg-[#151515] hover:bg-[#1a1a1a]'
                                }`}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <EditableName
                                        name={node.name}
                                        isSelected={isSelected}
                                        onChange={(newName) =>
                                            setNodes(nodes.map((n) => (n.id === node.id ? { ...n, name: newName } : n)))
                                        }
                                    />

                                    <span className="text-[#999] text-[12px] w-[60px] flex-shrink-0 whitespace-nowrap text-right">
                                        ID: {node.id}
                                    </span>
                                </div>

                                {nodeEdges.length > 0 && (
                                    <ul className="ml-4 mt-1 text-[12px] text-[#aaa]">
                                        {nodeEdges.map((edge) => (
                                            <li key={`${edge.from}-${edge.to}`}>{`Связь: ${edge.from} → ${edge.to}`}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>

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
