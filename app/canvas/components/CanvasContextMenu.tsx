import { useEffect, useRef, useMemo, RefObject } from 'react';
import { ContextMenu } from '@/components/UI/ContextMenu';
import { ContextMenuItem } from '@/components/UI/ContextMenuItem';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';
import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';

type CanvasContextMenuProps = {
    isOpen: boolean;
    position: { x: number; y: number };
    closeMenu: () => void;
    canvasRef: RefObject<HTMLCanvasElement | null>;
};

type MenuItem = {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    shortcut?: string;
    type?: 'divider';
};

export function CanvasContextMenu({ isOpen, position, closeMenu }: CanvasContextMenuProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    const { items, selectedItemIds, offset } = useCanvasStore();

    const nodes = useMemo(() => getNodes(items), [items]);
    const edges = useMemo(() => getEdges(items), [items]);

    const handlers = useCanvasHandlers();

    const createItem = (
        label: string,
        onClick: () => void,
        options?: { disabled?: boolean; shortcut?: string },
    ): MenuItem => ({
        label,
        onClick,
        disabled: options?.disabled,
        shortcut: options?.shortcut,
    });

    const createDivider = (): MenuItem => ({ type: 'divider' });

    const menuItems: MenuItem[] = useMemo(() => {
        const selectGroup = [
            createItem('Выбрать всё', handlers.selectAll, { disabled: items.length === 0, shortcut: 'Ctrl + A' }),
            createItem('Выбрать все узлы', handlers.selectAllNodes, { disabled: nodes.length === 0 }),
            createItem('Выбрать все связи', handlers.selectAllEdges, { disabled: edges.length === 0, shortcut: 'Ctrl + E' }),
        ];

        const editGroup = [
            createItem('Открыть в инспекторе', handlers.openInspector, { disabled: selectedItemIds.length !== 1 }),
            createItem('Добавить узел', handlers.addNode, { shortcut: 'Shift + A' }),
            createItem('Добавить связь', handlers.startEdge, {
                disabled: selectedItemIds.length !== 1 || !nodes.some((n) => n.id === selectedItemIds[0]),
                shortcut: 'Shift + E',
            }),
        ];

        const deleteGroup = [
            createItem('Удалить выбранное', handlers.delete, { disabled: selectedItemIds.length === 0, shortcut: 'Del' }),
        ];

        return [...selectGroup, createDivider(), ...editGroup, createDivider(), ...deleteGroup];
    }, [items, nodes, edges, selectedItemIds, handlers]);

    useEffect(() => {
        if (offset.x || offset.y) {
            closeMenu();
        }
    }, [offset.x, offset.y, closeMenu]);

    return (
        <ContextMenu isOpen={isOpen} position={position} onClose={closeMenu} ref={menuRef}>
            {menuItems.map((item, idx) =>
                item.type === 'divider' ? (
                    <hr key={idx} className="border-b-0 border-border-light my-1" />
                ) : (
                    <ContextMenuItem
                        key={idx}
                        onClick={() => {
                            item.onClick?.();
                            closeMenu();
                        }}
                        disabled={item.disabled}
                        shortcut={item.shortcut}
                    >
                        {item.label}
                    </ContextMenuItem>
                ),
            )}
        </ContextMenu>
    );
}
