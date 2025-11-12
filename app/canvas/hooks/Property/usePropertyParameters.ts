import { useState, useCallback } from 'react';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

import { PropertyType } from '@/canvas/canvas.types';

import { v4 as uuidv4 } from 'uuid';

export const usePropertyParameters = () => {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const selectedItem = useCanvasStore((state) => state.selectedItem);
    const parameters = useCanvasStore((state) => state.parameters);

    const [selectedParamId, setSelectedParamId] = useState<string>('');

    const addedProperties = selectedItem?.properties || [];

    const filteredParameters = parameters.filter(
        (parameter) => !addedProperties.some((property) => property.parentId === parameter.id),
    );

    const selectedParameter = filteredParameters.find((param) => param.id === selectedParamId);
    const selectedTypeIcon = selectedParameter ? getDynamicIcon(selectedParameter.type) : undefined;
    const dropdownTitle = selectedParameter ? selectedParameter.name : 'Выбрать параметр';

    const addParameterById = useCallback(
        (parameterId: string) => {
            if (!selectedItem) return;

            const originalParameter = parameters.find((p) => p.id === parameterId);
            if (!originalParameter) return;

            const property: PropertyType = {
                ...originalParameter,
                id: uuidv4(),
                parentId: parameterId,
            };

            const updatedItems = items.map((item) =>
                item.id === selectedItem.id
                    ? {
                          ...item,
                          properties: [...(item.properties || []), property],
                      }
                    : item,
            );

            setItems(updatedItems);
        },
        [selectedItem, items, parameters, setItems],
    );

    const removeParameter = useCallback(
        (propertyId: string) => {
            if (!selectedItem) return;

            const updatedItems = items.map((item) =>
                item.id === selectedItem.id
                    ? {
                          ...item,
                          properties: (item.properties || []).filter((p) => p.id !== propertyId),
                      }
                    : item,
            );

            setItems(updatedItems);
        },
        [selectedItem, items, setItems],
    );

    const handleAddParameter = () => {
        if (selectedParamId) {
            addParameterById(selectedParamId);
            setSelectedParamId('');
        }
    };

    const handleRemoveParameter = (propertyId: string) => {
        removeParameter(propertyId);
    };

    const handleUpdateParameter = useCallback(
        (propertyId: string, updates: Partial<PropertyType>) => {
            if (!selectedItem) return;

            const updatedItems = items.map((item) =>
                item.id === selectedItem.id
                    ? {
                          ...item,
                          properties: (item.properties || []).map((p) => (p.id === propertyId ? { ...p, ...updates } : p)),
                      }
                    : item,
            );

            setItems(updatedItems);
        },
        [selectedItem, items, setItems],
    );

    return {
        selectedParamId,
        setSelectedParamId,
        filteredParameters,
        selectedTypeIcon,
        dropdownTitle,
        handleAddParameter,
        handleRemoveParameter,
        handleUpdateParameter,
    };
};
