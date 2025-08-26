'use client';

import { getMousePosition } from '@/canvas/utils/getMousePosition';
import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { handleDeleteNode } from '@/canvas/utils/handleDeleteNode';

import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

type CanvasContextMenuProps = {
    isOpen: boolean;
    position: { x: number; y: number };
    closeMenu: () => void;
    offset: { x: number; y: number };
    zoomLevel: number;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export function CanvasContextMenu({ isOpen, position, closeMenu, offset, zoomLevel, canvasRef }: CanvasContextMenuProps) {
    const { nodes, setNodes, selectedNodeIds, setSelectedNodeIds, edges, setEdges, setTempEdge } = useCanvasStore();

    return (
        <ContextMenu isOpen={isOpen} position={position} onClose={closeMenu}>
            <ContextMenuItem
                onClick={() => {
                    setSelectedNodeIds(nodes.map((n) => n.id));
                    closeMenu();
                }}
                disabled={nodes.length === 0}
                shortcut="Ctrl + A"
            >
                Выбрать всё
            </ContextMenuItem>

            <hr className="border-b-0 border-[#2d2d2d] my-1" />

            <ContextMenuItem
                onClick={(e) => {
                    if (!e || !canvasRef.current) return;

                    const rect = canvasRef.current.getBoundingClientRect();
                    const mousePos = getMousePosition(e.nativeEvent, rect, offset, zoomLevel);

                    setNodes(handleAddNode(nodes, { x: mousePos.x, y: mousePos.y }));

                    closeMenu();
                }}
                shortcut="Shift + A"
            >
                Добавить узел
            </ContextMenuItem>

            <ContextMenuItem
                onClick={(e) => {
                    if (!e || selectedNodeIds.length !== 1 || !canvasRef.current) return;

                    const rect = canvasRef.current.getBoundingClientRect();
                    const mousePos = getMousePosition(e.nativeEvent, rect, offset, zoomLevel);

                    const fromNodeId = selectedNodeIds[0];
                    setTempEdge({ from: fromNodeId, toPos: mousePos });

                    closeMenu();
                }}
                disabled={selectedNodeIds.length !== 1}
                shortcut="Shift + E"
            >
                Добавить связь
            </ContextMenuItem>

            <hr className="border-b-0 border-[#2d2d2d] my-1" />

            <ContextMenuItem
                onClick={() => {
                    if (selectedNodeIds.length === 0) return;

                    const { nodes: newNodes, edges: newEdges } = handleDeleteNode(nodes, edges, selectedNodeIds);

                    setNodes(newNodes);
                    setEdges(newEdges);
                    setSelectedNodeIds([]);
                    closeMenu();
                }}
                disabled={selectedNodeIds.length === 0}
                shortcut="Del"
            >
                Удалить выбранное
            </ContextMenuItem>
        </ContextMenu>
    );
}
