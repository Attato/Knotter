'use client';

import { useState, useEffect } from 'react';
import { NODE_SHAPE_TYPES, NODE_MOVE_MIN_STEP } from '@/canvas/constants';
import { NodeShapeType, Position } from '@/canvas/canvas.types';

import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { handleItemNameChange } from '@/canvas/utils/handleItemNameChange';
import { moveNodes } from '@/canvas/utils/moveNodes';
import { getNodes } from '@/canvas/utils/getNodes';
import { getShape } from '@/canvas/utils/getShape';

import InfiniteSliderInput from '@/components/UI/InfiniteSliderInput';
import Dropdown from '@/components/UI/Dropdown';

export default function Inspector() {
    const { items, setItems, selectedItemIds, nodeMoveStep } = useCanvasStore();
    const selectedItem = items.find((i) => selectedItemIds.includes(i.id)) ?? null;

    const [name, setName] = useState(selectedItem?.name ?? '');
    const { changeNodeShapeType } = useCanvasHandlers();

    useEffect(() => {
        if (selectedItem) setName(selectedItem.name);
    }, [selectedItem, selectedItem?.name]);

    const handleChangeName = (newName: string) => {
        if (!selectedItem) return;
        setName(newName);
        handleItemNameChange(selectedItem, newName);
    };

    const nodesOnly = getNodes(items);
    const currentNode = selectedItem ? nodesOnly.find((n) => n.id === selectedItem.id) || selectedItem : null;
    const nodeType = currentNode?.kind === 'node' ? currentNode.shapeType : null;

    const handleChangeNodeShapeType = (newType: NodeShapeType) => {
        if (!currentNode || currentNode.kind !== 'node') return;
        changeNodeShapeType([currentNode.id], newType);
    };

    const handleMove = (axis: 'x' | 'y', value: number) => {
        if (!currentNode || currentNode.kind !== 'node') return;

        const initialPositions = new Map<string, Position>();
        selectedItemIds.forEach((id) => {
            const node = nodesOnly.find((n) => n.id === id);
            if (node) initialPositions.set(id, node.position);
        });

        const delta: Position = {
            x: axis === 'x' ? value - currentNode.position.x : 0,
            y: axis === 'y' ? value - currentNode.position.y : 0,
        };

        const updatedNodes = moveNodes(nodesOnly, selectedItemIds, initialPositions, delta, nodeMoveStep);
        const updatedItems = items.map((i) => updatedNodes.find((n) => n.id === i.id) ?? i);

        setItems(updatedItems);
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto m-2 gap-2">
            {!selectedItem ? (
                <div className="flex justify-center items-center h-full text-gray text-sm text-center">
                    Выберите элемент для инспектора
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => handleChangeName(e.target.value)}
                        className="w-full h-8 bg-card text-foreground placeholder-gray pl-3 pr-3 text-sm rounded-md focus:outline-none"
                        placeholder="Название"
                    />

                    <Dropdown title="Форма" disabled={selectedItem.kind === 'edge'}>
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
                                                : 'hover:bg-ui focus-visible:bg-ui'
                                        }`}
                                    >
                                        <Icon size={24} />
                                        <span className="text-xs truncate overflow-hidden w-full text-center">
                                            {shape.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </Dropdown>

                    <Dropdown title="Трансформация" disabled={selectedItem.kind === 'edge'}>
                        <p className="text-sm">Положение</p>

                        <InfiniteSliderInput
                            label="X"
                            value={currentNode?.kind !== 'edge' ? (currentNode?.position.x ?? 0) : 0}
                            step={NODE_MOVE_MIN_STEP}
                            onChange={(val) => handleMove('x', val)}
                        />

                        <InfiniteSliderInput
                            label="Y"
                            value={currentNode?.kind !== 'edge' ? (currentNode?.position.y ?? 0) : 0}
                            step={NODE_MOVE_MIN_STEP}
                            onChange={(val) => handleMove('y', val)}
                        />
                    </Dropdown>
                </>
            )}
        </div>
    );
}
