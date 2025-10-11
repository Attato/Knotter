'use client';

import { memo, useMemo, useState, useCallback } from 'react';

import { useInspector } from '@/canvas/hooks/useInspector';

import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';
import { Dropdown } from '@/components/UI/Dropdown';

import { ShapeButtons } from '@/canvas/components/ShapeButtons';
import { PositionInputs } from '@/canvas/components/PositionInputs';

import { v4 as uuidv4 } from 'uuid';

import { Plus } from 'lucide-react';

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

    const [dropdowns, setDropdowns] = useState<{ id: number | string; title: string }[]>([
        { id: 1, title: 'Форма' },
        { id: 2, title: 'Трансформация' },
    ]);

    const addDropdown = useCallback(() => {
        setDropdowns((prev) => [
            ...prev,
            {
                id: uuidv4(),
                title: `Выпадающий список (${prev.length + 1})`,
            },
        ]);
    }, []);

    const renameDropdown = useCallback((id: number | string, newTitle: string) => {
        setDropdowns((prev) => prev.map((dd) => (dd.id === id ? { ...dd, title: newTitle } : dd)));
    }, []);

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

            {dropdowns
                .filter((dd) => typeof dd.id === 'number')
                .map((dd) => (
                    <Dropdown key={dd.id} title={dd.title} disabled={isEdge}>
                        {dd.id === 1 ? shapeButtons : dd.id === 2 ? positionInputs : null}
                    </Dropdown>
                ))}

            <hr className="border-b-0 border-border" />

            {dropdowns
                .filter((dd) => typeof dd.id === 'string')
                .map((dd) => (
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
