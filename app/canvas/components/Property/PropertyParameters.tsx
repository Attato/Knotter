'use client';

import { useState, memo } from 'react';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { useParametersStore } from '@/canvas/store/parametersStore';
import { PropertyType } from '@/canvas/canvas.types';

import { PropertyParameterItem } from '@/canvas/components/Property/PropertyParameterItem';
import { Plus } from 'lucide-react';

interface PropertyParametersProps {
    parameters: PropertyType[];
    onAddParameter?: (parameterId: string) => void;
    onRemoveParameter?: (parameterId: string) => void;
    onUpdateParameter: (parameterId: string, updates: Partial<PropertyType>) => void;
}

export const PropertyParameters = memo(function PropertyParameters({
    parameters,
    onAddParameter,
    onRemoveParameter,
    onUpdateParameter,
}: PropertyParametersProps) {
    const availableParameters = useParametersStore((state) => state.parameters);
    const [selectedParamId, setSelectedParamId] = useState<string>('');

    const filteredAvailableParameters = availableParameters.filter(
        (param) => !parameters.some((p) => p.name === param.name),
    );

    const selectedParameter = filteredAvailableParameters.find((param) => param.id === selectedParamId);

    const dropdownTitle = selectedParameter ? `${selectedParameter.name} (${selectedParameter.type})` : 'Выбрать параметр';

    const handleAddParameter = () => {
        if (selectedParamId && onAddParameter) {
            onAddParameter(selectedParamId);
            setSelectedParamId('');
        }
    };

    const handleRemoveParameter = (parameterId: string) => {
        if (onRemoveParameter) {
            onRemoveParameter(parameterId);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            {onAddParameter && (
                <div className="flex gap-1">
                    <DropdownAbsolute title={dropdownTitle} light>
                        <div className="max-h-48 overflow-y-auto">
                            {filteredAvailableParameters.map((param) => (
                                <div
                                    key={param.id}
                                    onClick={() => setSelectedParamId(param.id)}
                                    className={`px-3 py-2 w-full flex justify-between rounded-md cursor-pointer mb-1 ${
                                        selectedParamId === param.id
                                            ? 'bg-bg-accent text-white'
                                            : 'bg-ui-hover hover:bg-border-light'
                                    }`}
                                >
                                    <span>{param.name}</span>
                                    <span className="text-sm">({param.type})</span>
                                </div>
                            ))}

                            {filteredAvailableParameters.length === 0 && (
                                <div className="px-3 py-2 text-gray text-sm text-center">Все параметры добавлены</div>
                            )}
                        </div>
                    </DropdownAbsolute>

                    <button
                        onClick={handleAddParameter}
                        disabled={!selectedParamId}
                        className={`${!selectedParamId ? 'bg-ui/50 text-foreground/50' : 'bg-ui '}  flex items-center justify-center max-w-[36px] w-full h-[36px] rounded-md cursor-pointer`}
                        title="Добавить выбранный параметр"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            )}

            {parameters.map((param) => (
                <PropertyParameterItem
                    key={param.id}
                    parameter={param}
                    onRemove={() => handleRemoveParameter(param.id)}
                    onUpdate={(updates) => onUpdateParameter(param.id, updates)}
                />
            ))}
        </div>
    );
});
