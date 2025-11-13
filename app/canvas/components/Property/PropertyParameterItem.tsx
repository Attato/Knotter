'use client';

import { memo } from 'react';
import { PropertyType, Parameter, Enum } from '@/canvas/canvas.types';
import { Input } from '@/components/UI/Input';
import { Checkbox } from '@/components/UI/Checkbox';
import { Select } from '@/components/UI/Select';
import { X } from 'lucide-react';
import { usePropertyParameterItem } from '@/canvas/hooks/Property/usePropertyParameterItem';
import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

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
    const {
        handleNumber,
        handleString,
        handleBoolean,
        handleEnum,
        handleArrayItem,
        enumData,
        arrayData,
        parameterType,
        value,
        name,
    } = usePropertyParameterItem({ parameter, handleUpdateParameter });

    const Icon = getDynamicIcon(parameter.type);

    if (parameterType.isArray) {
        if (!arrayData) return null;

        return (
            <div className="flex flex-col gap-2 bg-card rounded-md py-2 px-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon size={16} />
                        <p className="text-sm font-medium text-foreground truncate">{name}</p>
                    </div>

                    <button
                        onClick={handleRemoveParameter}
                        className="text-gray cursor-pointer w-8 h-8 flex items-center justify-center"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-col gap-1 w-full pl-6">
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
                                        className="bg-border border border-ui"
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
                                        className="w-full bg-border border border-ui"
                                        inputMode="decimal"
                                    />
                                )}

                                {item.type === 'string' && (
                                    <Input
                                        value={String(item.value ?? '')}
                                        onChange={(val) => handleArrayItem(item.id, val, 'string')}
                                        className="w-full bg-border border border-ui"
                                        placeholder="Введите текст..."
                                    />
                                )}

                                {item.type === 'boolean' && (
                                    <div className="flex items-center w-full">
                                        <Checkbox
                                            checked={Boolean(item.value)}
                                            onChange={(checked) => handleArrayItem(item.id, checked, 'boolean')}
                                            className="bg-border border border-ui"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    const renderInput = () => {
        if (parameterType.isNumber) {
            return (
                <Input
                    value={String(value ?? 0)}
                    onChange={handleNumber}
                    className="w-full bg-border"
                    type="text"
                    inputMode="decimal"
                />
            );
        }

        if (parameterType.isString) {
            return (
                <Input
                    value={String(value ?? '')}
                    onChange={handleString}
                    className="w-full bg-border"
                    placeholder="Введите текст..."
                />
            );
        }

        if (parameterType.isBoolean) {
            return (
                <div className="flex items-center">
                    <Checkbox checked={Boolean(value)} onChange={handleBoolean} />
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
                    className="w-full border"
                />
            );
        }
    };

    return (
        <div className="bg-card px-3 py-1 rounded-md">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 w-full">
                    <Icon size={16} />
                    <p className="text-sm font-medium text-foreground truncate">{name}</p>
                </div>

                {renderInput()}

                <button
                    onClick={handleRemoveParameter}
                    className="text-gray cursor-pointer w-8 h-8 flex items-center justify-center"
                    title="Удалить параметр"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
});
