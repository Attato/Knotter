'use client';

import { memo } from 'react';

import { useInspector } from '@/canvas/hooks/Inspector/useInspector';

import { EmptyState } from '@/components/UI/EmptyState';
import { Input } from '@/components/UI/Input';
import { Textarea } from '@/components/UI/Textarea';

import { Property } from '@/canvas/components/Property/Property';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

export const Inspector = memo(function Inspector() {
    const { selectedItem, handleChangeName, handleChangeDescription } = useInspector();

    const Icon = getDynamicIcon(selectedItem?.kind || 'bug');

    if (!selectedItem) {
        return <EmptyState message="Выберите элемент для инспектора" />;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-46px)] overflow-y-auto">
            <div className="flex flex-col gap-1 m-1">
                <Input value={selectedItem.name} onChange={handleChangeName} placeholder="Название" icon={Icon} />
                <Textarea value={selectedItem.description} onChange={handleChangeDescription} placeholder="Описание" />
            </div>

            <Property />
        </div>
    );
});
