'use client';

import { memo, useMemo } from 'react';

import { useInspector } from '@/canvas/hooks/useInspector';

import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';
import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/ShapeButtons';
import { PositionInputs } from '@/canvas/components/PositionInputs';

import { Plus } from 'lucide-react';

export const Inspector = memo(function Inspector() {
    const {
        selectedItem,
        isEdge,
        shapeType,
        positionX,
        positionY,
        dropdowns,
        handleChangeName,
        handleChangeDescription,
        handleChangeNodeShapeType,
        handleMove,
        addDropdown,
        renameDropdown,
    } = useInspector();

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
            <div className="flex justify-center items-center h-full text-gray text-sm text-center">
                Выберите элемент для инспектора
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto m-1 gap-1">
            <Input value={selectedItem.name} onChange={handleChangeName} placeholder="Название" />
            <Textarea value={selectedItem.description} onChange={handleChangeDescription} placeholder="Описание" />

            {dropdowns.static.map((dd) => (
                <Dropdown key={dd.id} title={dd.title} disabled={isEdge}>
                    {dd.id === 1 ? shapeButtons : dd.id === 2 ? positionInputs : null}
                </Dropdown>
            ))}

            <hr className="border-b-0 border-border" />

            {dropdowns.dynamic.map((dd) => (
                <Dropdown key={dd.id} title={dd.title} onRename={(newTitle) => renameDropdown(dd.id, newTitle)}>
                    <></>
                </Dropdown>
            ))}

            <button
                onClick={addDropdown}
                className="flex justify-start gap-2 items-center px-3 py-2 w-full text-sm cursor-pointer bg-card hover:bg-ui rounded-md"
            >
                <Plus size={16} />
                Добавить выпадающий список
            </button>
        </div>
    );
});
