'use client';

import { useCallback, useMemo } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useParametersStore } from '@/canvas/store/parametersStore';

import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';
import { useInspector } from '@/canvas/hooks/Inspector/useInspector';

import { moveNodes } from '@/canvas/utils/nodes/moveNodes';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

import { NodeShapeType, Position, Node, PropertyType } from '@/canvas/canvas.types';

export interface IDropdown {
    id: number | string;
    title: string;
}

export function useProperty() {
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const nodeMoveStep = useCanvasStore((state) => state.nodeMoveStep);
    const parameters = useParametersStore((state) => state.parameters);

    const { changeNodeShapeType } = useCanvasHandlers();

    const { selectedItem } = useInspector();

    const nodesMap = useMemo(() => {
        const map = new Map<string, Node>();
        getNodes(items).forEach((n: Node) => map.set(n.id, n));
        return map;
    }, [items]);

    const currentItem = useMemo(() => {
        if (!selectedItem) return null;
        return selectedItem.kind === 'node' ? (nodesMap.get(selectedItem.id) ?? selectedItem) : selectedItem;
    }, [selectedItem, nodesMap]);

    const staticDropdowns = useMemo(
        (): IDropdown[] => [
            { id: 1, title: 'Форма' },
            { id: 2, title: 'Трансформация' },
        ],
        [],
    );

    const itemParameters = useMemo((): PropertyType[] => {
        if (!currentItem) return [];
        return (currentItem.properties as PropertyType[]) || [];
    }, [currentItem]);

    const isEdge = selectedItem?.kind === 'edge';
    const shapeType = currentItem?.kind === 'node' ? currentItem.shapeType : null;
    const positionX = currentItem?.position.x ?? 0;
    const positionY = currentItem?.position.y ?? 0;

    const addParameterById = useCallback(
        (parameterId: string) => {
            if (!currentItem) return;

            const originalParameter = parameters.find((p) => p.id === parameterId);

            if (!originalParameter) return;

            const property: PropertyType = {
                ...originalParameter,
                id: uuidv4(),
                parentId: parameterId,
            };

            const updatedItems = items.map((item) =>
                item.id === currentItem.id
                    ? {
                          ...item,
                          properties: [...(item.properties || []), property],
                      }
                    : item,
            );

            setItems(updatedItems);
        },
        [currentItem, items, parameters, setItems],
    );

    const removeParameter = useCallback(
        (propertyId: string) => {
            if (!currentItem) return;

            const updatedItems = items.map((item) =>
                item.id === currentItem.id
                    ? {
                          ...item,
                          properties: (item.properties || []).filter((p) => p.id !== propertyId),
                      }
                    : item,
            );

            setItems(updatedItems);
        },
        [currentItem, items, setItems],
    );

    const updateParameter = useCallback(
        (propertyId: string, updates: Partial<PropertyType>) => {
            if (!currentItem) return;

            const updatedItems = items.map((item) =>
                item.id === currentItem.id
                    ? {
                          ...item,
                          properties: (item.properties || []).map((p) => (p.id === propertyId ? { ...p, ...updates } : p)),
                      }
                    : item,
            );

            setItems(updatedItems);
        },
        [currentItem, items, setItems],
    );

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
        staticDropdowns,
        parameters: itemParameters,

        selectedItem,
        currentItem,

        isEdge,
        shapeType,
        positionX,
        positionY,

        addParameterById,
        removeParameter,
        updateParameter,
        handleChangeNodeShapeType,
        handleMove,
    };
}
