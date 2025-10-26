'use client';

import { memo, useMemo } from 'react';

import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/Inspector/ShapeButtons';
import { PositionInputs } from '@/canvas/components/Inspector/PositionInputs';
import { PropertyParameters } from '@/canvas/components/Property/PropertyParameters';

import { useProperty } from '@/canvas/hooks/Property/useProperty';

import type { IDropdown } from '@/canvas/hooks/Property/useProperty';

import { Plus } from 'lucide-react';

export const Property = memo(function Property() {
    const {
        staticDropdowns,
        dynamicDropdowns,
        isEdge,
        shapeType,
        positionX,
        positionY,
        handleChangeNodeShapeType,
        handleMove,
        addDropdown,
        renameDropdown,

        addParameterToDropdown,
        removeParameterFromDropdown,
        updateParameterInDropdown,
        currentItem,
    } = useProperty();

    const shapeButtons = useMemo(() => {
        if (isEdge) return null;

        return <ShapeButtons shapeType={shapeType} onTypeChange={handleChangeNodeShapeType} />;
    }, [isEdge, shapeType, handleChangeNodeShapeType]);

    const positionInputs = useMemo(() => {
        if (isEdge) return null;

        return <PositionInputs positionX={positionX} positionY={positionY} onMove={handleMove} />;
    }, [isEdge, positionX, positionY, handleMove]);

    return (
        <div className="flex flex-col gap-1">
            <div className="mx-1 flex flex-col gap-1">
                {staticDropdowns.map((dd: IDropdown) => (
                    <Dropdown key={dd.id} title={dd.title} disabled={isEdge}>
                        {dd.id === 1 ? shapeButtons : dd.id === 2 ? positionInputs : null}
                    </Dropdown>
                ))}
            </div>

            <hr className="border-b-0 border-border" />

            <div className="mx-1 flex flex-col gap-1">
                <button
                    onClick={addDropdown}
                    className="flex justify-start gap-2 items-center px-3 py-2 w-full text-sm cursor-pointer bg-card hover:bg-ui rounded-md"
                >
                    <Plus size={16} />
                    Создать пользовательские свойства
                </button>

                {dynamicDropdowns.map((dd: IDropdown) => {
                    const property = currentItem?.properties.find((p) => p.id === dd.id);

                    return (
                        <Dropdown key={dd.id} title={dd.title} onRename={(newTitle) => renameDropdown(dd.id, newTitle)}>
                            <PropertyParameters
                                dropdownId={dd.id as string}
                                propertyParameters={property?.parameters || []}
                                onAddParameter={addParameterToDropdown}
                                onRemoveParameter={removeParameterFromDropdown}
                                onUpdateParameter={updateParameterInDropdown}
                            />
                        </Dropdown>
                    );
                })}
            </div>
        </div>
    );
});
