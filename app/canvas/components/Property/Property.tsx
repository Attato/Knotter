'use client';

import { memo } from 'react';

import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/Inspector/ShapeButtons';
import { PositionInputs } from '@/canvas/components/Inspector/PositionInputs';
import { PropertyParameters } from '@/canvas/components/Property/PropertyParameters';

import { useProperty } from '@/canvas/hooks/Property/useProperty';
import { useDropdownStore } from '@/canvas/store/dropdownStore';

export const Property = memo(function Property() {
    const { staticDropdowns, isEdge, shapeType, positionX, positionY, handleChangeNodeShapeType, handleMove } =
        useProperty();

    const { toggleDropdown, isDropdownOpen } = useDropdownStore();

    return (
        <div className="flex flex-col gap-1">
            <div className="mx-1 flex flex-col gap-1">
                {staticDropdowns.map((dd) => (
                    <Dropdown
                        key={dd.id}
                        title={dd.title}
                        disabled={isEdge}
                        isOpen={isDropdownOpen(dd.id)}
                        onToggle={() => toggleDropdown(dd.id)}
                    >
                        {dd.id === 1 && !isEdge && (
                            <ShapeButtons shapeType={shapeType} onTypeChange={handleChangeNodeShapeType} />
                        )}

                        {dd.id === 2 && !isEdge && (
                            <PositionInputs positionX={positionX} positionY={positionY} onMove={handleMove} />
                        )}
                    </Dropdown>
                ))}
            </div>

            <hr className="border-b-0 border-border" />

            <div className="mx-1 flex flex-col gap-1">
                <Dropdown
                    title="Пользовательские свойства"
                    isOpen={isDropdownOpen(staticDropdowns.length + 1)}
                    onToggle={() => toggleDropdown(staticDropdowns.length + 1)}
                >
                    <PropertyParameters />
                </Dropdown>
            </div>
        </div>
    );
});
