'use client';

import { useState } from 'react';
import { CanvasItem, NodeShapeType } from '@/canvas/canvas.types';
import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import { handleItemNameChange } from '@/canvas/utils/handleItemNameChange';
import { NODE_SHAPE_TYPES } from '@/canvas/constants';
import { getShape } from '@/canvas/utils/getShape';
import Dropdown from '@/components/UI/Dropdown';

type InspectorProps = {
    item: CanvasItem;
};

const AxisInfo = ({ label, value }: { label: string; value: number }) => (
    <div className="flex gap-2 bg-ui px-2 py-1 rounded-md items-center w-full">
        <div className="w-5 flex justify-center">{label}</div>
        <div className="w-px bg-border-light h-6" />
        <span className="select-text">{value.toFixed(0)}</span>
    </div>
);

export default function Inspector({ item }: InspectorProps) {
    const { items } = useCanvasStore();
    const [name, setName] = useState(item.name);

    const currentItem = items.find((i) => i.id === item.id) || item;
    const nodeType = currentItem.kind === 'node' ? currentItem.shapeType : null;

    const { changeNodeShapeType } = useCanvasHandlers();

    const handleChangeNodeShapeType = (newType: NodeShapeType) => {
        if (item.kind !== 'node') return;
        changeNodeShapeType([item.id], newType);
    };

    return (
        <div className="flex flex-col m-2 gap-2">
            <input
                type="text"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    handleItemNameChange(item, e.target.value);
                }}
                className="w-full h-8 bg-card text-foreground placeholder-gray pl-3 pr-3 text-sm rounded-md focus:outline-none"
                placeholder="Название"
            />

            <Dropdown title="Форма">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,min-content))] gap-2">
                    {NODE_SHAPE_TYPES.map((type) => {
                        const shape = getShape(type);
                        const Icon = shape.icon;
                        const isActive = nodeType === type;
                        return (
                            <button
                                key={type}
                                onClick={() => handleChangeNodeShapeType(type)}
                                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-md cursor-pointer max-w-[96px] w-full focus-visible:outline-0 ${
                                    isActive
                                        ? 'text-text-accent bg-bg-accent/10 hover:bg-bg-accent/10 focus-visible:bg-bg-accent/15'
                                        : ' hover:bg-ui focus-visible:bg-ui'
                                }`}
                            >
                                <Icon size={24} />
                                <span className="text-xs truncate overflow-hidden w-full text-center">{shape.label}</span>
                            </button>
                        );
                    })}
                </div>
            </Dropdown>

            <Dropdown title="Трансформация">
                <p className="text-sm">Позиция</p>

                <AxisInfo label="X" value={currentItem.position.x} />
                <AxisInfo label="Y" value={currentItem.position.y} />
            </Dropdown>
        </div>
    );
}
