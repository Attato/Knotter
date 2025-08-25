'use client';

import { Node, Edge } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { updateNodeSelection } from '@/canvas/utils/updateNodeSelection';

export default function CanvasSidebar() {
    const { nodes, edges, selectedNodeIds, setSelectedNodeIds } = useCanvasStore();

    const handleNodeClick = (nodeId: number, e: React.MouseEvent) => {
        const newSelectedIds = updateNodeSelection(nodes, selectedNodeIds, nodeId, e);
        setSelectedNodeIds(newSelectedIds);
    };

    return (
        <aside className="w-120 border-l border-[#1a1a1a] flex flex-col bg-[#0f0f0f] select-none">
            {nodes.length === 0 ? (
                <p className="px-4">-</p>
            ) : (
                <ul className="flex-1 overflow-y-auto">
                    {nodes.map((node: Node) => {
                        const isSelected = selectedNodeIds.includes(node.id);
                        const nodeEdges = edges.filter((edge: Edge) => edge.from === node.id || edge.to === node.id);

                        return (
                            <li
                                key={node.id}
                                onClick={(e) => handleNodeClick(node.id, e)}
                                className={`px-4 py-2 m-1 rounded-md cursor-pointer ${
                                    isSelected ? 'bg-[#388bfd1a]' : 'hover:bg-[#1a1a1a]'
                                }`}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <span className={`${isSelected ? 'text-[#4493f8]' : ''}`}>Узел</span>
                                    <span className="text-[#ccc] text-[12px]">ID: {node.id}</span>
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
            )}
        </aside>
    );
}
