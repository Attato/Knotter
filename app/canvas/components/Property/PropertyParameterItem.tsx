'use client';

import { memo } from 'react';
import { X, OctagonAlert } from 'lucide-react';
import { PropertyType, ParameterValue, Enum } from '@/canvas/canvas.types';
import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { Select } from '@/components/UI/Select';
import { useParametersStore } from '@/canvas/store/parametersStore';

import {
    isNumberValue,
    isStringValue,
    isBooleanValue,
    isEnumValue,
    isArrayValue,
} from '@/canvas/hooks/Parameters/useParametersItem';

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

    const handleValueChange = (value: ParameterValue) => {
        onUpdate({ value });
    };

    const renderParameterInput = () => {
        const { value } = parameter;

        if (isNumberValue(value)) {
            return (
                <Input
                    value={String(value || 0)}
                    onChange={(val) => handleValueChange(Number(val))}
                    className="w-full bg-ui"
                    type="text"
                    inputMode="decimal"
                />
            );
        }

        if (isStringValue(value)) {
            return <Input value={String(value || '')} onChange={handleValueChange} className="bg-ui" />;
        }

        if (isBooleanValue(value)) {
            return (
                <div className="flex items-center h-[36px]">
                    <Checkbox checked={Boolean(value)} onChange={handleValueChange} />
                </div>
            );
        }

        if (isEnumValue(value)) {
            const options = value.options?.values || [];
            const selectedValue = value.selectedId
                ? options.find((opt) => opt === value.selectedId) || options[0]
                : options[0];

            return (
                <Select
                    value={selectedValue}
                    onChange={(val) => {
                        const newValue: Enum = {
                            ...value,
                            selectedId: val,
                        };
                        handleValueChange(newValue);
                    }}
                    options={options}
                    className="w-full"
                />
            );
        }

        if (isArrayValue(value)) {
            return <></>;
        }

        return (
            <div className="flex items-center h-[36px] px-3 bg-ui rounded-md border border-border">
                <span className="text-sm text-gray">Неподдерживаемый тип</span>
            </div>
        );
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
