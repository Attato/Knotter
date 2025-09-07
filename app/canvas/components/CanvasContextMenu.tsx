import { getMousePosition } from '@/canvas/utils/getMousePosition';
import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { handleDeleteItems } from '@/canvas/utils/handleDeleteItems';
import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';

type CanvasContextMenuProps = {
    isOpen: boolean;
    position: { x: number; y: number };
    closeMenu: () => void;
    offset: { x: number; y: number };
    zoomLevel: number;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export function CanvasContextMenu({ isOpen, position, closeMenu, offset, zoomLevel, canvasRef }: CanvasContextMenuProps) {
    const { items, setItems, selectedItemIds, setSelectedItemIds, setTempEdge } = useCanvasStore();

    const nodes = getNodes(items);
    const edges = getEdges(items);

    return (
        <ContextMenu isOpen={isOpen} position={position} onClose={closeMenu}>
            <ContextMenuItem
                onClick={() => {
                    setSelectedItemIds(items.map((i) => i.id));
                    closeMenu();
                }}
                disabled={items.length === 0}
                shortcut="Ctrl + A"
            >
                Выбрать всё
            </ContextMenuItem>

            <ContextMenuItem
                onClick={() => {
                    setSelectedItemIds(nodes.map((n) => n.id));
                    closeMenu();
                }}
                disabled={nodes.length === 0}
            >
                Выбрать все узлы
            </ContextMenuItem>

            <ContextMenuItem
                onClick={() => {
                    setSelectedItemIds(edges.map((e) => e.id));
                    closeMenu();
                }}
                disabled={edges.length === 0}
            >
                Выбрать все связи
            </ContextMenuItem>

            <hr className="border-b-0 border-[#2d2d2d] my-1" />

            <ContextMenuItem
                onClick={(e) => {
                    if (!e || !canvasRef.current) return;

                    const rect = canvasRef.current.getBoundingClientRect();
                    const mousePos = getMousePosition(e.nativeEvent, rect, offset, zoomLevel);

                    const newNode = handleAddNode(nodes, { x: mousePos.x, y: mousePos.y });

                    setItems([...items, newNode]);
                    setSelectedItemIds([newNode.id]);
                    closeMenu();
                }}
                shortcut="Shift + A"
            >
                Добавить узел
            </ContextMenuItem>

            <ContextMenuItem
                onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                    if (!e || selectedItemIds.length !== 1 || !canvasRef.current) return;

                    const selectedNodeId = selectedItemIds[0];
                    if (!nodes.some((n) => n.id === selectedNodeId)) return;

                    const rect = canvasRef.current.getBoundingClientRect();
                    const mousePos = getMousePosition(e.nativeEvent, rect, offset, zoomLevel);

                    setTempEdge({ from: selectedNodeId, toPos: mousePos });
                    closeMenu();
                }}
                disabled={selectedItemIds.length !== 1 || !nodes.some((n) => n.id === selectedItemIds[0])}
                shortcut="Shift + E"
            >
                Добавить связь
            </ContextMenuItem>

            <hr className="border-b-0 border-[#2d2d2d] my-1" />

            <ContextMenuItem
                onClick={() => {
                    if (selectedItemIds.length === 0) return;

                    const newItems = handleDeleteItems(items, selectedItemIds);

                    setItems(newItems);
                    setSelectedItemIds([]);
                    closeMenu();
                }}
                disabled={selectedItemIds.length === 0}
                shortcut="Del"
            >
                Удалить выбранное
            </ContextMenuItem>
        </ContextMenu>
    );
}
