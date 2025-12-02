'use client';

import { memo } from 'react';
import { PropertyParameterItem } from '@/canvas/components/Property/PropertyParameterItem';
import { OptionPicker } from '@/components/UI/OptionPicker';
import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';
import { usePropertyParameters } from '@/canvas/hooks/Property/usePropertyParameters';
import { Node } from '@/canvas/canvas.types';

interface PropertyParametersProps {
    node: Node;
}

export const PropertyParameters = memo(function PropertyParameters({ node }: PropertyParametersProps) {
    const { filteredParameters, handleAddParameter, handleRemoveParameter, handleUpdateParameter } =
        usePropertyParameters(node);

    const properties = node?.properties || [];

    const options = filteredParameters.map((param) => ({
        value: param.id,
        label: param.name,
        icon: getDynamicIcon(param.type),
    }));

    return (
        <div className="flex flex-col gap-1">
            {properties.map((property) => (
                <PropertyParameterItem
                    key={property.id}
                    parameter={property}
                    handleRemoveParameter={() => handleRemoveParameter(property.id)}
                    handleUpdateParameter={(updates) => handleUpdateParameter(property.id, updates)}
                />
            ))}

            {handleAddParameter && (
                <div className="max-w-sm w-full m-auto">
                    <OptionPicker
                        options={options}
                        onSelect={(id) => handleAddParameter(id)}
                        placeholder="Выберите параметр"
                        className="flex-1"
                    />
                </div>
            )}
        </div>
    );
});
