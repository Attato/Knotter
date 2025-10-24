'use client';

import { useState, useCallback, useMemo } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';

import { moveNodes } from '@/canvas/utils/nodes/moveNodes';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

import { NodeShapeType, Position, Node } from '@/canvas/canvas.types';

export interface IDropdown {
    id: number | string;
    title: string;
}

export function useProperty() {
    const [dropdowns, setDropdowns] = useState<IDropdown[]>([
        { id: 1, title: 'Форма' },
        { id: 2, title: 'Трансформация' },
    ]);

    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const nodeMoveStep = useCanvasStore((state) => state.nodeMoveStep);

    const { changeNodeShapeType } = useCanvasHandlers();

    const selectedItem = useMemo(() => {
        if (selectedItemIds.length === 0) return null;
        return items.find((i) => i.id === selectedItemIds[0]) ?? null;
    }, [items, selectedItemIds]);

    const nodesMap = useMemo(() => {
        const map = new Map<string, Node>();
        getNodes(items).forEach((n: Node) => map.set(n.id, n));
        return map;
    }, [items]);

    const currentItem = useMemo(() => {
        if (!selectedItem) return null;
        return selectedItem.kind === 'node' ? (nodesMap.get(selectedItem.id) ?? selectedItem) : selectedItem;
    }, [selectedItem, nodesMap]);

    const isEdge = selectedItem?.kind === 'edge';
    const shapeType = currentItem?.kind === 'node' ? currentItem.shapeType : null;
    const positionX = currentItem?.position.x ?? 0;
    const positionY = currentItem?.position.y ?? 0;

    const addDropdown = useCallback(() => {
        setDropdowns((prev) => {
            const dynamicCount = prev.filter((dd) => typeof dd.id === 'string').length;

            return [
                ...prev,
                {
                    id: uuidv4(),
                    title: `Свойства (${dynamicCount + 1})`,
                },
            ];
        });
    }, []);

    const renameDropdown = useCallback((id: number | string, newTitle: string) => {
        setDropdowns((prev) => prev.map((dd) => (dd.id === id ? { ...dd, title: newTitle } : dd)));
    }, []);

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

    const staticDropdowns = dropdowns.filter((dd) => typeof dd.id === 'number');
    const dynamicDropdowns = dropdowns.filter((dd) => typeof dd.id === 'string');

    return {
        dropdowns,
        staticDropdowns,
        dynamicDropdowns,

        selectedItem,
        currentItem,

        isEdge,
        shapeType,
        positionX,
        positionY,

        addDropdown,
        renameDropdown,
        handleChangeNodeShapeType,
        handleMove,
    };
}
