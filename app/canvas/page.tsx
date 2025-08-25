'use client';

import { useRef } from 'react';
import Link from 'next/link';

import { useCanvasControls } from '@/canvas/hooks/useCanvasControls';
import { useCanvasRenderer } from '@/canvas/hooks/useCanvasRenderer';
import { useContextMenu } from '@/canvas/hooks/useContextMenu';

import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { handleDeleteNode } from '@/canvas/utils/handleDeleteNode';
import { getMousePosition } from '@/canvas/utils/getMousePosition';
import { ContextMenu } from '@/canvas/components/ContextMenu';
import { ContextMenuItem } from '@/canvas/components/ContextMenuItem';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { nodes, setNodes, selectedNodeIds, setSelectedNodeIds, edges, setEdges, tempEdge, setTempEdge } =
        useCanvasStore();

    const { offset, zoomLevel, selectionStart, selectionEnd } = useCanvasControls(canvasRef);

    useCanvasRenderer(canvasRef, offset, zoomLevel, selectionStart, selectionEnd, nodes, selectedNodeIds, edges, tempEdge);

    const { isOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen relative" onClick={closeMenu}>
            <Link href="/" className="absolute top-4 left-4">
                На главную
            </Link>

            <div className="absolute bottom-4 left-4 select-none">{zoomLevel.toFixed(2)}x</div>

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

                <hr className="border-b-0 border-[#2d2d2d]" />

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

                <hr className="border-b-0 border-[#2d2d2d]" />

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

            {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center text-[#aaa]">
                        Нажмите <strong className="pl-1"> ПКМ </strong>, чтобы начать творить.
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} className="w-full h-full" onContextMenu={handleContextMenu} />
        </div>
    );
}
