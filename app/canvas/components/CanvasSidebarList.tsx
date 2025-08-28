import { useState, useRef } from 'react';
import { Node } from '@/canvas/canvas.types';
import { EditableName } from '@/canvas/components/EditableName';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { updateNodeSelection } from '@/canvas/utils/updateNodeSelection';

import { GripVertical } from 'lucide-react';

export default function CanvasSidebarList({ filterText }: { filterText: string }) {
    const { nodes, edges, selectedNodeIds, setSelectedNodeIds, setNodes } = useCanvasStore();

    const filteredNodes = nodes.filter((node) => node.name.toLowerCase().includes(filterText.toLowerCase()));

    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const dragNodeRef = useRef<Node | null>(null);

    const handleMouseDown = (index: number) => {
        setDraggingIndex(index);
        dragNodeRef.current = nodes[index];
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
        if (draggingIndex === null) return;

        const listItems = Array.from(e.currentTarget.children) as HTMLElement[];

        listItems.forEach((li, idx) => {
            if (li.parentElement !== e.currentTarget) return;

            const rect = li.getBoundingClientRect();

            if (e.clientY > rect.top && e.clientY < rect.bottom && idx !== draggingIndex) {
                const newNodes = [...nodes];
                newNodes.splice(draggingIndex, 1);
                newNodes.splice(idx, 0, dragNodeRef.current!);
                setNodes(newNodes);
                setDraggingIndex(idx);
            }
        });
    };

    const handleMouseUp = () => {
        setDraggingIndex(null);
        dragNodeRef.current = null;
    };

    return (
        <ul className="flex-1 overflow-y-auto" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            {filteredNodes.length === 0 ? (
                <li className=" flex justify-center p-4 m-1 text-[#888] text-sm">Ничего не найдено.</li>
            ) : (
                filteredNodes.map((node: Node, index: number) => {
                    const isSelected = selectedNodeIds.includes(node.id);
                    const nodeEdges = edges.filter((edge) => edge.from === node.id || edge.to === node.id);

                    return (
                        <li
                            key={node.id}
                            onMouseDown={() => handleMouseDown(index)}
                            onClick={(e) => {
                                const newSelectedIds = updateNodeSelection(nodes, selectedNodeIds, node.id, e);
                                setSelectedNodeIds(newSelectedIds);
                            }}
                            className={`flex flex-col px-4 py-2 m-1 rounded-md cursor-pointer tabular-nums transition-all duration-150 ${
                                isSelected ? 'bg-[#388bfd1a]' : 'bg-[#151515] hover:bg-[#1a1a1a]'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <EditableName
                                    name={node.name}
                                    isSelected={isSelected}
                                    onChange={(newName) =>
                                        setNodes(nodes.map((n) => (n.id === node.id ? { ...n, name: newName } : n)))
                                    }
                                />
                                <GripVertical color="#999" size={16} />
                            </div>

                            {nodeEdges.length > 0 && (
                                <ul className="ml-4 mt-1 space-y-1">
                                    {nodeEdges.map((edge) => {
                                        const fromNode = nodes.find((n) => n.id === edge.from);
                                        const toNode = nodes.find((n) => n.id === edge.to);

                                        return (
                                            <li
                                                key={`${edge.from}-${edge.to}`}
                                                className="text-[12px] text-[#aaa] cursor-pointer"
                                            >
                                                {`Связь: ${fromNode?.name} → ${toNode?.name}`}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    );
                })
            )}
        </ul>
    );
}
