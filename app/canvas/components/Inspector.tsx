'use client';

import { memo, useMemo } from 'react';

import { useInspector } from '@/canvas/hooks/useInspector';

import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';
import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/ShapeButtons';
import { PositionInputs } from '@/canvas/components/PositionInputs';

export const Inspector = memo(function Inspector() {
    const { selectedItem, currentItem, handleChangeName, handleChangeDescription, handleChangeNodeShapeType, handleMove } =
        useInspector();

    const isEdge = selectedItem?.kind === 'edge';
    const shapeType = currentItem?.kind === 'node' ? currentItem.shapeType : null;
    const positionX = currentItem?.position.x ?? 0;
    const positionY = currentItem?.position.y ?? 0;

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
        <div className="flex flex-col h-full overflow-y-auto m-2 gap-2">
            <Input value={selectedItem.name} onChange={handleChangeName} placeholder="Название" />

            <Textarea value={selectedItem.description} onChange={handleChangeDescription} placeholder="Описание" />

            <Dropdown title="Форма" disabled={isEdge}>
                {shapeButtons}
            </Dropdown>

            <Dropdown title="Трансформация" disabled={isEdge}>
                {positionInputs}
            </Dropdown>
        </div>
    );
});
