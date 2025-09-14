'use client';

import { useState, useEffect } from 'react';
import { CanvasItem, NodeType } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { Octagon, Circle, Squircle, Hexagon, Triangle, Diamond, Dot, type LucideIcon } from 'lucide-react';

import { handleItemNameChange } from '@/canvas/utils/handleItemNameChange';

type InspectorProps = {
    item: CanvasItem;
};

const NODE_TYPES: NodeType[] = ['octagon', 'circle', 'squircle', 'hexagon', 'triangle', 'diamond', 'point'];

const ICONS: Record<NodeType, LucideIcon> = {
    octagon: Octagon,
    circle: Circle,
    squircle: Squircle,
    hexagon: Hexagon,
    triangle: Triangle,
    diamond: Diamond,
    point: Dot,
};

export default function Inspector({ item }: InspectorProps) {
    const { items, setItems } = useCanvasStore();
    const [name, setName] = useState(item.name);
    const [nodeType, setNodeType] = useState<NodeType | null>(item.kind === 'node' ? item.type : null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setName(item.name);
        if (item.kind === 'node') setNodeType(item.type);
    }, [item]);

    const handleTypeChange = (newType: NodeType) => {
        if (item.kind !== 'node') return;

        setNodeType(newType);
        setItems(items.map((i) => (i.kind === 'node' && i.id === item.id ? { ...i, type: newType } : i)));
        setIsOpen(false);
    };

    const ShapePreview = ({ type, size }: { type: NodeType; size: number }) => {
        const Icon = ICONS[type];
        return <Icon size={size} />;
    };

    return (
        <div className="flex items-center m-2 relative">
            {nodeType && (
                <div className="relative">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className={`h-8 px-2 flex items-center gap-1 justify-center rounded-l-md ${isOpen ? 'bg-ui' : 'bg-card'} hover:bg-ui border-r border-border transition cursor-pointer`}
                    >
                        <ShapePreview type={nodeType} size={20} />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-card rounded-md shadow-lg z-50 flex flex-col">
                            {NODE_TYPES.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleTypeChange(type)}
                                    className="w-full flex items-center gap-2 px-2 py-1 hover:bg-ui transition cursor-pointer rounded-md"
                                >
                                    <ShapePreview type={type} size={24} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <input
                type="text"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    handleItemNameChange(item, e.target.value);
                }}
                className="w-full h-8 bg-card text-foreground placeholder-gray pl-3 pr-9 text-sm rounded-r-md focus:outline-none"
                placeholder="Название"
            />
        </div>
    );
}
