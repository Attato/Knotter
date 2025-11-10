'use client';

import { useCallback, useMemo } from 'react';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';

import { moveNodes } from '@/canvas/utils/nodes/moveNodes';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

import { NodeShapeType, Position } from '@/canvas/canvas.types';

export interface IDropdown {
    id: number | string;
    title: string;
}

const DROPDOWNS: IDropdown[] = [
    { id: 1, title: 'Форма' },
    { id: 2, title: 'Трансформация' },
];

export function useProperty() {
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const selectedItem = useCanvasStore((state) => state.selectedItem);
    const nodeMoveStep = useCanvasStore((state) => state.nodeMoveStep);

    const { changeNodeShapeType } = useCanvasHandlers();

    const staticDropdowns = useMemo(() => DROPDOWNS, []);

    const isEdge = selectedItem?.kind === 'edge';
    const shapeType = selectedItem?.kind === 'node' ? selectedItem.shapeType : null;
    const positionX = selectedItem?.position.x ?? 0;
    const positionY = selectedItem?.position.y ?? 0;

    const handleChangeNodeShapeType = useCallback(
        (type: NodeShapeType) => {
            if (selectedItemIds.length === 0) return;
            changeNodeShapeType(selectedItemIds, type);
        },
        [selectedItemIds, changeNodeShapeType],
    );

    const handleMove = useCallback(
        (axis: 'x' | 'y', value: number) => {
            if (!selectedItem || selectedItem.kind !== 'node') return;

            const initialPositions = new Map<string, Position>();
            selectedItemIds.forEach((id) => {
                const node = items.find((n) => n.id === id && n.kind === 'node');
                if (node) initialPositions.set(id, node.position);
            });

            const delta: Position = {
                x: axis === 'x' ? value - selectedItem.position.x : 0,
                y: axis === 'y' ? value - selectedItem.position.y : 0,
            };

            const updatedNodes = moveNodes(getNodes(items), selectedItemIds, initialPositions, delta, nodeMoveStep);
            const updatedItems = items.map((i) => updatedNodes.find((n) => n.id === i.id) ?? i);

            setItems(updatedItems);
        },
        [selectedItem, selectedItemIds, nodeMoveStep, items, setItems],
    );

    return {
        staticDropdowns,

        isEdge,
        shapeType,
        positionX,
        positionY,

        handleChangeNodeShapeType,
        handleMove,
    };
}
