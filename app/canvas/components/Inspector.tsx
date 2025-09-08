'use client';

import { useState, useEffect } from 'react';
import { CanvasItem } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

type InspectorProps = {
    item: CanvasItem;
    onNameChange?: (newName: string) => void;
};

export default function Inspector({ item, onNameChange }: InspectorProps) {
    const { items, setItems } = useCanvasStore();
    const [name, setName] = useState(item.name);

    useEffect(() => {
        setName(item.name);
    }, [item]);

    const handleChange = (newName: string) => {
        setName(newName);

        const updatedItems = items.map((i) => (i.id === item.id ? { ...i, name: newName } : i));
        setItems(updatedItems);

        onNameChange?.(newName);
    };

    return (
        <div className="flex flex-col gap-1 m-2">
            <label className="text-gray-300 text-sm">Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full px-4 py-2 rounded-md focus-visible:outline-2 outline-[#388bfd] tabular-nums transition-all duration-150 cursor-pointer bg-[#151515] hover:bg-[#1a1a1a] text-sm text-white"
            />
        </div>
    );
}
