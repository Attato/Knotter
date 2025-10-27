'use client';

import { memo, useMemo } from 'react';

import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/Inspector/ShapeButtons';
import { PositionInputs } from '@/canvas/components/Inspector/PositionInputs';
import { PropertyParameters } from '@/canvas/components/Property/PropertyParameters';

import { useProperty } from '@/canvas/hooks/Property/useProperty';

export const Property = memo(function Property() {
    const {
        staticDropdowns,
        isEdge,
        shapeType,
        positionX,
        positionY,
        parameters,
        handleChangeNodeShapeType,
        handleMove,

        addParameterById,
        removeParameter,
        updateParameter,
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
                {staticDropdowns.map((dd) => (
                    <Dropdown key={dd.id} title={dd.title} disabled={isEdge}>
                        {dd.id === 1 ? shapeButtons : dd.id === 2 ? positionInputs : null}
                    </Dropdown>
                ))}
            </div>

            <hr className="border-b-0 border-border" />

            <div className="mx-1 flex flex-col gap-1">
                <Dropdown title="Пользовательские свойства">
                    <PropertyParameters
                        parameters={parameters}
                        onAddParameter={addParameterById}
                        onRemoveParameter={removeParameter}
                        onUpdateParameter={updateParameter}
                    />
                </Dropdown>
            </div>
        </div>
    );
});
