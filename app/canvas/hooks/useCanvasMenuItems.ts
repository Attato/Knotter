import { useMemo } from 'react';

import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';
import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';

export type MenuItem = {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    shortcut?: string;
    type?: 'divider';
    submenu?: MenuItem[];
};

export function useCanvasMenuItems() {
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
            createItem('Открыть в инспекторе', handlers.openInspector, { disabled: selectedItemIds.length !== 1 }),
            createDivider(),
            { label: 'Выбрать', submenu: selectGroup },
            { label: 'Добавить', submenu: addGroup },
            createDivider(),
            ...deleteGroup,
        ];
    }, [items, nodes, edges, selectedItemIds, handlers]);

    return { menuItems, offset };
}
