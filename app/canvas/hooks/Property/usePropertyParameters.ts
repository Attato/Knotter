import { useCallback } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { PropertyType, Node } from '@/canvas/canvas.types';
import { v4 as uuidv4 } from 'uuid';

export const usePropertyParameters = (node: Node | null) => {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const parameters = useCanvasStore((state) => state.parameters);

    const addedProperties = node?.properties || [];

    const filteredParameters = parameters.filter(
        (parameter) => !addedProperties.some((property) => property.parentId === parameter.id),
    );

    const handleAddParameter = useCallback(
        (parameterId: string) => {
            if (!node) return;

            const originalParameter = parameters.find((p) => p.id === parameterId);
            if (!originalParameter) return;

            const property: PropertyType = {
                ...originalParameter,
                id: uuidv4(),
                parentId: parameterId,
            };

            const updatedItems = items.map((item) =>
                item.id === node.id
                    ? {
                          ...item,
                          properties: [...(item.properties || []), property],
                      }
                    : item,
            );

            setItems(updatedItems);
        },
        [node, items, parameters, setItems],
    );

    const handleRemoveParameter = useCallback(
        (propertyId: string) => {
            if (!node) return;

            const updatedItems = items.map((item) =>
                item.id === node.id
                    ? {
                          ...item,
                          properties: (item.properties || []).filter((p) => p.id !== propertyId),
                      }
                    : item,
            );

            setItems(updatedItems);
        },
        [node, items, setItems],
    );

    const handleUpdateParameter = useCallback(
        (propertyId: string, updates: Partial<PropertyType>) => {
            if (!node) return;

            const updatedItems = items.map((item) =>
                item.id === node.id
                    ? {
                          ...item,
                          properties: (item.properties || []).map((p) => (p.id === propertyId ? { ...p, ...updates } : p)),
                      }
                    : item,
            );

            setItems(updatedItems);
        },
        [node, items, setItems],
    );

    return {
        filteredParameters,
        handleAddParameter,
        handleRemoveParameter,
        handleUpdateParameter,
    };
};
