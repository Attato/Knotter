'use client';

import { memo } from 'react';

import { useInspector } from '@/canvas/hooks/Inspector/useInspector';

import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';

import { Property } from '@/canvas/components/Property/Property';

export const Inspector = memo(function Inspector() {
    const { selectedItem, handleChangeName, handleChangeDescription } = useInspector();

    if (!selectedItem) {
        return (
            <div className="flex flex-col justify-center items-center h-full text-gray text-sm text-center">
                Выберите элемент для инспектора
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-46px)] overflow-y-auto">
            <div className="flex flex-col gap-1 m-1">
                <Input value={selectedItem.name} onChange={handleChangeName} placeholder="Название" />
                <Textarea value={selectedItem.description} onChange={handleChangeDescription} placeholder="Описание" />
            </div>

            <Property />
        </div>
    );
});
