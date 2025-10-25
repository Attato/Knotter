'use client';

import { memo } from 'react';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { useParametersStore } from '@/canvas/store/parametersStore';
import { Parameter } from '@/canvas/canvas.types';

import { PropertyParameterItem } from '@/canvas/components/Property/PropertyParameterItem';

interface PropertyParametersProps {
    dropdownId: string;
    propertyParameters: Parameter[];
    onAddParameter: (dropdownId: string, parameterId: string) => void;
    onRemoveParameter: (dropdownId: string, parameterId: string) => void;
    onUpdateParameter: (dropdownId: string, parameterId: string, updates: Partial<Parameter>) => void;
}

export const PropertyParameters = memo(function PropertyParameters({
    dropdownId,
    propertyParameters,
    onAddParameter,
    onRemoveParameter,
    onUpdateParameter,
}: PropertyParametersProps) {
    const parameters = useParametersStore((state) => state.parameters);

    return (
        <div className="flex flex-col gap-1">
            <DropdownAbsolute title="Добавить параметр" light>
                <div className="max-h-48 overflow-y-auto">
                    {parameters
                        .filter((param) => !propertyParameters.some((p) => p.name === param.name))
                        .map((param) => (
                            <button
                                key={param.id}
                                onClick={() => onAddParameter(dropdownId, param.id)}
                                className="px-3 py-2 w-full flex justify-between bg-ui-hover hover:bg-border-light rounded-md cursor-pointer mb-1"
                            >
                                <span>{param.name}</span>
                                <span className="text-gray text-sm">({param.type})</span>
                            </button>
                        ))}

                    {parameters.filter((param) => !propertyParameters.some((p) => p.name === param.name)).length === 0 && (
                        <div className="px-3 py-2 text-gray text-sm text-center">Все параметры добавлены</div>
                    )}
                </div>
            </DropdownAbsolute>

            {propertyParameters.map((param) => (
                <PropertyParameterItem
                    key={param.id}
                    parameter={param}
                    onUpdate={(updates) => onUpdateParameter(dropdownId, param.id, updates)}
                    onRemove={() => onRemoveParameter(dropdownId, param.id)}
                />
            ))}
        </div>
    );
});
