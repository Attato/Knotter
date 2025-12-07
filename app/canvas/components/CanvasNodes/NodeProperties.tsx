import { useCallback } from 'react';

import { Node, PropertyType, NumberConfig } from '@/canvas/canvas.types';

import { InfiniteSliderInput } from '@/components/UI/InfiniteSliderInput';

import { useCanvasStore } from '@/canvas/store/canvasStore';

interface NodePropertiesProps {
    node: Node;
}

function isNumberProperty(
    property: PropertyType,
): property is Omit<PropertyType, 'value'> & { value: NumberConfig; type: 'number' } {
    return (
        property.type === 'number' &&
        typeof property.value === 'object' &&
        property.value !== null &&
        'base' in property.value &&
        'min' in property.value &&
        'max' in property.value
    );
}

export function NodeProperties({ node }: NodePropertiesProps) {
    const properties = node?.properties;

    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);

    const updateNodeProperty = useCallback(
        (nodeId: string, propertyId: string, newValue: PropertyType['value']) => {
            const newItems = items.map((item) => {
                if (item.kind === 'node' && item.id === nodeId) {
                    return {
                        ...item,
                        properties: item.properties.map((prop) => {
                            if (prop.id === propertyId) {
                                return {
                                    ...prop,
                                    value: newValue,
                                };
                            }
                            return prop;
                        }),
                    };
                }
                return item;
            });

            setItems(newItems);
        },
        [items, setItems],
    );

    const createSliderChangeHandler = (propertyId: string, currentValue: NumberConfig) => (newBase: number) => {
        const { min = 0, max = 100 } = currentValue;
        const clampedValue = Math.max(min, Math.min(max, newBase));

        const updatedValue: NumberConfig = {
            ...currentValue,
            base: clampedValue,
        };

        updateNodeProperty(node.id, propertyId, updatedValue);
    };

    return (
        <div className="flex flex-col gap-1">
            {properties.map((property) => {
                const numberConfig = isNumberProperty(property) ? property.value : null;

                return (
                    <div className="flex flex-col gap-1" key={property.id}>
                        {numberConfig && (
                            <div className="flex items-center gap-2 w-full">
                                <InfiniteSliderInput
                                    value={numberConfig.base}
                                    min={numberConfig.min}
                                    max={numberConfig.max}
                                    name={property.name}
                                    onChange={createSliderChangeHandler(property.id, numberConfig)}
                                    showFill
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
