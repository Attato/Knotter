'use client';

import { memo, useMemo } from 'react';

import { useInspector } from '@/canvas/hooks/Inspector/useInspector';

import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';
import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/Inspector/ShapeButtons';
import { PositionInputs } from '@/canvas/components/Inspector/PositionInputs';

import { Plus } from 'lucide-react';
import { useProperty } from '@/canvas/hooks/Property/useProperty';

import { IDropdown } from '@/canvas/hooks/Property/useProperty';

export const Inspector = memo(function Inspector() {
    const {
        selectedItem,
        isEdge,
        shapeType,
        positionX,
        positionY,
        handleChangeName,
        handleChangeDescription,
        handleChangeNodeShapeType,
        handleMove,
    } = useInspector();

    const { staticDropdowns, dynamicDropdowns, addDropdown, renameDropdown } = useProperty();

    const shapeButtons = useMemo(() => {
        if (!selectedItem || isEdge) return null;

        return <ShapeButtons shapeType={shapeType} onTypeChange={handleChangeNodeShapeType} />;
    }, [selectedItem, isEdge, shapeType, handleChangeNodeShapeType]);

    const positionInputs = useMemo(() => {
        if (!selectedItem || isEdge) return null;

        return <PositionInputs positionX={positionX} positionY={positionY} onMove={handleMove} />;
    }, [selectedItem, isEdge, positionX, positionY, handleMove]);

    if (!selectedItem) {
        return (
            <div className="flex flex-col justify-center items-center h-full text-gray text-sm text-center">
                Выберите элемент для инспектора
            </div>
        );
    }

    return (
        <div className="flex flex-col max-h-[calc(100vh - 38px)] overflow-y-auto m-1 gap-1">
            <Input value={selectedItem.name} onChange={handleChangeName} placeholder="Название" />
            <Textarea value={selectedItem.description} onChange={handleChangeDescription} placeholder="Описание" />

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

            {dynamicDropdowns.map((dd: IDropdown) => (
                <Dropdown key={dd.id} title={dd.title} onRename={(newTitle) => renameDropdown(dd.id, newTitle)}>
                    <></>
                </Dropdown>
            ))}
        </div>
    );
});
