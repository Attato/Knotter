'use client';

import { useCallback, useMemo } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { CanvasItem } from '@/canvas/canvas.types';

import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';

import { moveNodes } from '@/canvas/utils/nodes/moveNodes';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

import { NodeShapeType } from '@/canvas/utils/nodes/getShape';

import { Position, Node } from '@/canvas/canvas.types';

export interface IDropdown {
    id: number | string;
    title: string;
}

const DROPDOWNS: IDropdown[] = [
    { id: 1, title: 'Форма' },
    { id: 2, title: 'Трансформация' },
];

export function useInspector() {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const selectedItem = useCanvasStore((state) => state.selectedItem);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const nodeMoveStep = useCanvasStore((state) => state.nodeMoveStep);

    const { changeNodeShapeType } = useCanvasHandlers();

    const staticDropdowns = useMemo(() => DROPDOWNS, []);

    const isEdge = selectedItem?.kind === 'edge';
    const node: Node | null = selectedItem?.kind === 'node' ? selectedItem : null;

    const shapeType = node?.shapeType ?? null;
    const positionX = node?.position.x ?? 0;
    const positionY = node?.position.y ?? 0;

    const handleChangeNodeShapeType = useCallback(
        (type: NodeShapeType) => {
            if (selectedItemIds.length === 0) return;
            changeNodeShapeType(selectedItemIds, type);
        },
        [selectedItemIds, changeNodeShapeType],
    );

    const handleMove = useCallback(
        (axis: 'x' | 'y', value: number) => {
            if (!node) return;

            const initialPositions = new Map<string, Position>();

            selectedItemIds.forEach((id) => {
                const nodes = items.find((item) => item.id === id && item.kind === 'node');
                if (nodes) initialPositions.set(id, nodes.position);
            });

            const delta: Position = {
                x: axis === 'x' ? value - node.position.x : 0,
                y: axis === 'y' ? value - node.position.y : 0,
            };

            const updatedNodes = moveNodes(getNodes(items), selectedItemIds, initialPositions, delta, nodeMoveStep);
            const updatedItems = items.map((item) => updatedNodes.find((node) => node.id === item.id) ?? item);

            setItems(updatedItems);
        },
        [node, selectedItemIds, nodeMoveStep, items, setItems],
    );

    const handleItemNameChange = (items: CanvasItem[], item: CanvasItem, newName: string): CanvasItem[] => {
        return items.map((i) => (i.id === item.id && i.name !== newName ? { ...i, name: newName } : i));
    };

    const handleChangeName = useCallback(
        (newName: string) => {
            if (!selectedItem) return;

            const updatedItems = handleItemNameChange(items, selectedItem, newName);
            setItems(updatedItems);
        },
        [selectedItem, items, setItems],
    );

    const handleChangeDescription = useCallback(
        (newDesc: string) => {
            if (!selectedItem) return;

            const updatedItems = items.map((item) =>
                item.id === selectedItem.id ? { ...item, description: newDesc } : item,
            );
            setItems(updatedItems);
        },
        [selectedItem, items, setItems],
    );

    return {
        handleChangeName,
        handleChangeDescription,
        staticDropdowns,

        isEdge,
        node,
        shapeType,
        positionX,
        positionY,

        handleChangeNodeShapeType,
        handleMove,
    };
}
