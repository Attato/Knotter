'use client';

import { memo } from 'react';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';

import { PropertyParameterItem } from '@/canvas/components/Property/PropertyParameterItem';
import { Plus } from 'lucide-react';
import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';
import { usePropertyParameters } from '@/canvas/hooks/Property/usePropertyParameters';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export const PropertyParameters = memo(function PropertyParameters() {
    const {
        selectedParamId,
        setSelectedParamId,
        filteredParameters,
        selectedTypeIcon,
        dropdownTitle,
        handleAddParameter,
        handleRemoveParameter,
        handleUpdateParameter,
    } = usePropertyParameters();

    const selectedItem = useCanvasStore((state) => state.selectedItem);

    const properties = selectedItem?.properties || [];

    return (
        <div className="flex flex-col gap-1">
            {handleAddParameter && (
                <div className="flex gap-1">
                    <DropdownAbsolute title={dropdownTitle} icon={selectedTypeIcon}>
                        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                            {filteredParameters.map((param) => {
                                const Icon = getDynamicIcon(param.type);

                                return (
                                    <div
                                        key={param.id}
                                        onClick={() => setSelectedParamId(param.id)}
                                        className={`px-3 py-2 w-full flex items-center gap-2 rounded-md cursor-pointer  ${
                                            selectedParamId === param.id
                                                ? 'bg-bg-accent/10 text-text-accent'
                                                : 'bg-border hover:bg-ui'
                                        }`}
                                    >
                                        <Icon size={16} />
                                        <span className="flex-1">{param.name}</span>
                                    </div>
                                );
                            })}

                            {filteredParameters.length === 0 && (
                                <div className="px-3 py-2 text-gray text-sm text-center">Все параметры добавлены</div>
                            )}
                        </div>
                    </DropdownAbsolute>

                    <button
                        onClick={handleAddParameter}
                        disabled={!selectedParamId}
                        className={`${!selectedParamId ? 'bg-card/50 text-gray' : 'bg-card'}  flex items-center justify-center w-8 h-8 rounded-md cursor-pointer`}
                        title="Добавить выбранный параметр"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            )}

            {properties.map((property) => (
                <PropertyParameterItem
                    key={property.id}
                    parameter={property}
                    handleRemoveParameter={() => handleRemoveParameter(property.id)}
                    handleUpdateParameter={(updates) => handleUpdateParameter(property.id, updates)}
                />
            ))}
        </div>
    );
});
