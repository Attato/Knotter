'use client';

import { memo } from 'react';
import { X, OctagonAlert } from 'lucide-react';
import { PropertyType } from '@/canvas/canvas.types';
import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { Select } from '@/components/UI/Select';
import { useParametersStore } from '@/canvas/store/parametersStore'; // Добавляем импорт

interface PropertyParameterItemProps {
    parameter: PropertyType;
    onRemove: () => void;
    onUpdate: (updates: Partial<PropertyType>) => void;
}

export const PropertyParameterItem = memo(function PropertyParameterItem({
    parameter,
    onRemove,
    onUpdate,
}: PropertyParameterItemProps) {
    const globalParameters = useParametersStore((state) => state.parameters);

    const parameterExists = parameter.parentId ? globalParameters.some((p) => p.id === parameter.parentId) : false;

    if (!parameterExists) {
        return (
            <div className="flex items-center gap-1 bg-card rounded-md">
                <OctagonAlert size={16} className="text-axis-y mr-1" />
                <p className="text-sm font-medium text-gray flex-1">Параметр {parameter.name} был удалён</p>
                <button
                    onClick={onRemove}
                    className="text-gray cursor-pointer max-w-[36px] w-full h-[36px] flex items-center justify-center"
                    title="Удалить параметр"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    const handleValueChange = (value: string | number | boolean | string[]) => {
        onUpdate({ value });
    };

    const renderParameterInput = () => {
        switch (parameter.type) {
            case 'number':
                return (
                    <Input
                        value={String(parameter.value || 0)}
                        onChange={(val) => handleValueChange(Number(val))}
                        className="w-full bg-ui"
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

            case 'enum': {
                const options = Array.isArray(parameter.value) ? parameter.value : [];
                const selected = options[0] || '';

                const availableOptions = options.filter((opt) => opt !== selected);

                return (
                    <Select
                        value={selected}
                        onChange={(val) => {
                            const newValue = [val, ...options.filter((opt) => opt !== val)];
                            handleValueChange(newValue);
                        }}
                        options={availableOptions}
                        className="w-full"
                    />
                );
            }
        }
    };

    return (
        <div className="flex items-center gap-1 bg-card rounded-md">
            <p className="text-sm font-medium text-foreground text-right truncate mr-1 w-full">{parameter.name}</p>

            <div className="flex items-center gap-2 min-w-[180px] w-[calc(100%-60px)]">{renderParameterInput()}</div>

            <button
                onClick={onRemove}
                className="text-gray cursor-pointer max-w-[36px] w-full h-[36px] flex items-center justify-center"
                title="Удалить параметр"
            >
                <X size={16} />
            </button>
        </div>
    );
});
