import { useMemo } from 'react';
import { NodeShapeType } from '../../canvas.types';

import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';

import { getShape, getAllShapes } from '@/canvas/utils/nodes/getShape';
import { LucideIcon } from 'lucide-react';

export type MenuItem = {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    shortcut?: string;
    type?: 'divider';
    submenu?: MenuItem[];
    icon?: LucideIcon;
};

export function getShapeMenuItems(
    selectedIds: string[],
    changeShape: (ids: string[], type: NodeShapeType) => void,
): MenuItem[] {
    return getAllShapes().map((type) => {
        const { label, icon } = getShape(type);

        return {
            label,
            icon,
            onClick: () => changeShape(selectedIds, type),
        };
    });
}

export function useContextMenuItems() {
    const items = useCanvasStore((state) => state.items);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const offset = useCanvasStore((state) => state.offset);

    const nodes = useMemo(() => getNodes(items), [items]);
    const edges = useMemo(() => getEdges(items), [items]);

    const handlers = useCanvasHandlers();

    const createItem = (
        label: string,
        onClick: () => void,
        options?: { disabled?: boolean; shortcut?: string; icon?: LucideIcon },
    ): MenuItem => ({
        label,
        onClick,
        disabled: options?.disabled,
        shortcut: options?.shortcut,
        icon: options?.icon,
    });

    const createDivider = (): MenuItem => ({ type: 'divider' });

    const menuItems: MenuItem[] = useMemo(() => {
        const onlyNodesSelected =
            selectedItemIds.length > 0 && selectedItemIds.every((id) => nodes.some((n) => n.id === id));

        const shapeGroup = getShapeMenuItems(selectedItemIds, handlers.changeNodeShapeType);

        const selectGroup: MenuItem[] = [
            createItem('Выбрать всё', handlers.selectAll, { disabled: items.length === 0, shortcut: 'Ctrl + A' }),
            createItem('Выбрать все узлы', handlers.selectAllNodes, { disabled: nodes.length === 0 }),
            createItem('Выбрать все связи', handlers.selectAllEdges, { disabled: edges.length === 0, shortcut: 'Ctrl + E' }),
        ];

        const addGroup: MenuItem[] = [
            createItem('Добавить узел', handlers.addNode, { shortcut: 'Shift + A' }),
            createItem('Добавить связь', handlers.startEdge, {
                disabled: selectedItemIds.length !== 1 || !nodes.some((n) => n.id === selectedItemIds[0]),
                shortcut: 'Shift + E',
            }),
        ];

        const deleteGroup: MenuItem[] = [
            createItem('Удалить выбранное', handlers.delete, { disabled: selectedItemIds.length === 0, shortcut: 'Del' }),
        ];

        return [
            { label: 'Выбрать', submenu: selectGroup },
            { label: 'Добавить', submenu: addGroup },
            {
                label: 'Изменить форму',
                submenu: shapeGroup,
                disabled: !onlyNodesSelected,
            },
            createDivider(),
            ...deleteGroup,
        ];
    }, [items, nodes, edges, selectedItemIds, handlers]);

    return { menuItems, offset };
}
