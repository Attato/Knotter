'use client';

import { memo } from 'react';
import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { Parameter } from '@/canvas/canvas.types';
import { X } from 'lucide-react';

interface PropertyParameterItemProps {
    parameter: Parameter;
    onUpdate: (updates: Partial<Parameter>) => void;
    onRemove: () => void;
}

export const PropertyParameterItem = memo(function PropertyParameterItem({
    parameter,
    onUpdate,
    onRemove,
}: PropertyParameterItemProps) {
    const handleValueChange = (value: string | number | boolean) => {
        onUpdate({ value });
    };

    const updateEnumOption = (index: number, value: string) => {
        if (parameter.type !== 'enum' || !Array.isArray(parameter.value)) return;

        const newOptions = [...parameter.value];
        newOptions[index] = value;
        onUpdate({ value: newOptions });
    };

    const renderParameterInput = () => {
        switch (parameter.type) {
            case 'number':
                return (
                    <Input
                        value={String(parameter.value || 0)}
                        onChange={(val) => handleValueChange(Number(val))}
                        className="bg-ui w-full min-w-[220px]"
                        type="text"
                        inputMode="decimal"
                    />
                );

            case 'string':
                return <Input value={String(parameter.value || '')} onChange={handleValueChange} className="bg-ui" />;

            case 'boolean':
                return (
                    <div className="flex items-center h-[36px]">
                        <Checkbox checked={Boolean(parameter.value)} onChange={handleValueChange} />
                    </div>
                );

            case 'enum':
                return (
                    <div className="flex flex-col gap-1 w-full">
                        {(parameter.value as string[]).map((option, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <Input
                                    value={option}
                                    onChange={(val) => updateEnumOption(index, val)}
                                    className="bg-ui w-full min-w-[220px]"
                                />
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-start gap-1">
                <button onClick={onRemove} className="flex h-[36px] items-center text-gray cursor-pointer">
                    <X size={16} />
                </button>

                <p className="w-full text-sm bg-card text-right h-[36px] flex justify-end items-center mr-1">
                    {parameter.name}
                </p>

                <div className="flex items-center gap-1">{renderParameterInput()}</div>

                <div className="px-3 py-2 text-sm text-gray bg-border rounded-md max-w-[80px] w-full text-center">
                    {parameter.type}
                </div>
            </div>
        </div>
    );
});
