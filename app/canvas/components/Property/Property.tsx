'use client';

import { memo, useMemo } from 'react';

import { useInspector } from '@/canvas/hooks/Inspector/useInspector';

import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/Inspector/ShapeButtons';
import { PositionInputs } from '@/canvas/components/Inspector/PositionInputs';

import { Plus } from 'lucide-react';
import { useProperty } from '@/canvas/hooks/Property/useProperty';

import { IDropdown } from '@/canvas/hooks/Property/useProperty';

export const Property = memo(function PropertyEditor() {
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
    } = useProperty();

    const { selectedItem } = useInspector();

    const shapeButtons = useMemo(() => {
        if (!selectedItem || isEdge) return null;

        return <ShapeButtons shapeType={shapeType} onTypeChange={handleChangeNodeShapeType} />;
    }, [selectedItem, isEdge, shapeType, handleChangeNodeShapeType]);

    const positionInputs = useMemo(() => {
        if (!selectedItem || isEdge) return null;

        return <PositionInputs positionX={positionX} positionY={positionY} onMove={handleMove} />;
    }, [selectedItem, isEdge, positionX, positionY, handleMove]);

    return (
        <div className="flex flex-col gap-1">
            {staticDropdowns.map((dd: IDropdown) => (
                <Dropdown key={dd.id} title={dd.title} disabled={isEdge}>
                    {dd.id === 1 ? shapeButtons : dd.id === 2 ? positionInputs : null}
                </Dropdown>
            ))}

            <hr className="border-b-0 border-border" />

            <button
                onClick={addDropdown}
                className="flex justify-start gap-2 items-center px-3 py-2 w-full text-sm cursor-pointer bg-card hover:bg-ui rounded-md"
            >
                <Plus size={16} />
                Добавить выпадающий список
            </button>

            {dynamicDropdowns.map((dd: IDropdown) => {
                return (
                    <Dropdown key={dd.id} title={dd.title} onRename={(newTitle) => renameDropdown(dd.id, newTitle)}>
                        <></>
                    </Dropdown>
                );
            })}
        </div>
    );
});
