'use client';

import { useCallback, useMemo } from 'react';
import { NodeShapeType, Position, Node } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';
import { handleItemNameChange } from '@/canvas/utils/handleItemNameChange';
import { moveNodes } from '@/canvas/utils/moveNodes';
import { getNodes } from '@/canvas/utils/getNodes';

export function useInspector() {
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const nodeMoveStep = useCanvasStore((state) => state.nodeMoveStep);

    const { changeNodeShapeType } = useCanvasHandlers();

    const selectedItem = useMemo(() => {
        if (selectedItemIds.length === 0) return null;

        return items.find((i) => i.id === selectedItemIds[0]) ?? null;
    }, [items, selectedItemIds]);

    const handleChangeName = useCallback(
        (newName: string) => {
            if (!selectedItem) return;
            handleItemNameChange(selectedItem, newName);
        },
        [selectedItem],
    );

    const handleChangeDescription = useCallback(
        (newDesc: string) => {
            if (!selectedItem) return;
            const updatedItems = items.map((i) => (i.id === selectedItem.id ? { ...i, description: newDesc } : i));
            setItems(updatedItems);
        },
        [selectedItem, items, setItems],
    );

    const nodesMap = useMemo(() => {
        const map = new Map<string, Node>();
        getNodes(items).forEach((n: Node) => map.set(n.id, n));
        return map;
    }, [items]);

    const currentItem = useMemo(() => {
        if (!selectedItem) return null;
        return selectedItem.kind === 'node' ? (nodesMap.get(selectedItem.id) ?? selectedItem) : selectedItem;
    }, [selectedItem, nodesMap]);

    const handleChangeNodeShapeType = useCallback(
        (type: NodeShapeType) => {
            if (selectedItemIds.length === 0) return;
            changeNodeShapeType(selectedItemIds, type);
        },
        [selectedItemIds, changeNodeShapeType],
    );

    const handleMove = useCallback(
        (axis: 'x' | 'y', value: number) => {
            if (!currentItem || currentItem.kind !== 'node') return;

            const initialPositions = new Map<string, Position>();
            selectedItemIds.forEach((id) => {
                const node = items.find((n) => n.id === id && n.kind === 'node');
                if (node) initialPositions.set(id, node.position);
            });

            const delta: Position = {
                x: axis === 'x' ? value - currentItem.position.x : 0,
                y: axis === 'y' ? value - currentItem.position.y : 0,
            };

            const updatedNodes = moveNodes(getNodes(items), selectedItemIds, initialPositions, delta, nodeMoveStep);
            const updatedItems = items.map((i) => updatedNodes.find((n) => n.id === i.id) ?? i);

            setItems(updatedItems);
        },
        [currentItem, selectedItemIds, nodeMoveStep, items, setItems],
    );

    return {
        selectedItem,
        currentItem,
        handleChangeName,
        handleChangeDescription,
        handleChangeNodeShapeType,
        handleMove,
    };
}
