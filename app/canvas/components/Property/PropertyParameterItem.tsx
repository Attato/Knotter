'use client';

import { memo } from 'react';

import { PropertyType, Parameter, Enum, NumberConfig } from '@/canvas/canvas.types';

import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { Select } from '@/components/UI/Select';
import { InfiniteSliderInput } from '@/components/UI/InfiniteSliderInput';

import { usePropertyParameterItem } from '@/canvas/hooks/Property/usePropertyParameterItem';
import { isNumberValue, NUMBER_LIMITS } from '@/canvas/hooks/Parameters/useParametersItem';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

import { X } from 'lucide-react';

interface PropertyParameterItemProps {
    parameter: Parameter;
    handleRemoveParameter: () => void;
    handleUpdateParameter: (updates: Partial<PropertyType>) => void;
}

export const PropertyParameterItem = memo(function PropertyParameterItem({
    parameter,
    handleRemoveParameter,
    handleUpdateParameter,
}: PropertyParameterItemProps) {
    const { handleString, handleBoolean, handleEnum, handleArrayItem, enumData, arrayData, parameterType, value, name } =
        usePropertyParameterItem({ parameter, handleUpdateParameter });

    const Icon = getDynamicIcon(parameter.type);

    const getSliderValues = () => {
        if (parameterType.isNumber && isNumberValue(value)) {
            const numValue = value as NumberConfig;
            return {
                base: numValue.base,
                min: numValue.min,
                max: numValue.max,
            };
        }

        return { base: 0, min: NUMBER_LIMITS.MIN, max: NUMBER_LIMITS.MAX };
    };

    const handleSliderChange = (newBase: number) => {
        if (parameterType.isNumber && isNumberValue(value)) {
            const numValue = value as NumberConfig;
            const { min = 0, max = 100 } = numValue;

            const clampedValue = Math.max(min, Math.min(max, newBase));

            handleUpdateParameter({
                value: {
                    ...numValue,
                    base: clampedValue,
                },
            });
        }
    };

    const renderParameter = () => {
        if (parameterType.isNumber) {
            const { base, min, max } = getSliderValues();

            return (
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2">
                        <p className="truncate w-full text-right text-sm">Значение</p>

                        <InfiniteSliderInput value={base} min={min} max={max} onChange={handleSliderChange} showFill />
                    </div>
                </div>
            );
        }

        if (parameterType.isString) {
            return (
                <Input
                    value={String(value ?? '')}
                    onChange={handleString}
                    className="w-full bg-depth-3 border border-depth-4"
                    placeholder="Введите текст..."
                />
            );
        }

        if (parameterType.isBoolean) {
            return (
                <div className="flex items-center">
                    <Checkbox
                        checked={Boolean(value)}
                        onChange={handleBoolean}
                        className="bg-depth-3 border border-depth-4"
                    />
                </div>
            );
        }

        if (parameterType.isEnum) {
            if (!enumData) return null;

            return (
                <Select
                    value={enumData.selectedDisplay}
                    onChange={handleEnum}
                    options={enumData.options}
                    className="w-full border border-depth-4"
                />
            );
        }

        if (parameterType.isArray) {
            if (!arrayData) return null;

            return (
                <div className="flex flex-col gap-1 w-full pr-6">
                    {arrayData.length === 0 && <p className="p-2 text-gray text-sm">Массив пуст</p>}

                    {arrayData.map((item) => {
                        if (item.type === 'enum' && item.value && typeof item.value === 'object') {
                            const enumValue = item.value as Enum;
                            if (!enumValue.options) return null;

                            const selectedOption = enumValue.options.find((opt) => opt.id === enumValue.selectedId);
                            const currentValue = selectedOption?.value || selectedOption?.name || 'Не выбрано';
                            const options = enumValue.options.map((opt) => opt.value || opt.name || 'Без названия');

                            const handleEnumChange = (selectedValue: string) => {
                                const selectedOption = enumValue.options.find(
                                    (opt) => (opt.value || opt.name || 'Без названия') === selectedValue,
                                );

                                if (selectedOption) {
                                    const updatedEnum: Enum = {
                                        ...enumValue,
                                        selectedId: selectedOption.id,
                                    };
                                    handleArrayItem(item.id, updatedEnum, 'enum');
                                }
                            };

                            return (
                                <div key={item.id} className="flex items-center justify-end gap-2">
                                    <p className="text-sm font-medium text-foreground text-end truncate w-full">
                                        {item.name}
                                    </p>

                                    <Select
                                        value={currentValue}
                                        onChange={handleEnumChange}
                                        options={options}
                                        className="bg-depth-3 border border-depth-4"
                                    />
                                </div>
                            );
                        }

                        return (
                            <div key={item.id} className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground text-end truncate w-full">{item.name}</p>

                                {item.type === 'number' && (
                                    <Input
                                        value={String(item.value ?? 0)}
                                        onChange={(val) => {
                                            const num = parseFloat(val);
                                            handleArrayItem(item.id, isNaN(num) ? 0 : num, 'number');
                                        }}
                                        className="w-full bg-depth-3 border border-depth-4"
                                    />
                                )}

                                {item.type === 'string' && (
                                    <Input
                                        value={String(item.value ?? '')}
                                        onChange={(val) => handleArrayItem(item.id, val, 'string')}
                                        className="w-full bg-depth-3 border border-depth-4"
                                        placeholder="Введите текст..."
                                    />
                                )}

                                {item.type === 'boolean' && (
                                    <div className="flex items-center w-full">
                                        <Checkbox
                                            checked={Boolean(item.value)}
                                            onChange={(checked) => handleArrayItem(item.id, checked, 'boolean')}
                                            className="bg-depth-3 border border-depth-4"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex flex-col gap-2 bg-depth-2 rounded-md py-2 px-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon size={16} />
                    <p className="text-sm font-medium text-foreground truncate">{name}</p>
                </div>

                <button
                    onClick={handleRemoveParameter}
                    className="text-gray cursor-pointer flex items-center justify-center"
                >
                    <X size={16} />
                </button>
            </div>

            {renderParameter()}
        </div>
    );
});
