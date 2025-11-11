'use client';

import { memo } from 'react';
import { PropertyType, Parameter } from '@/canvas/canvas.types';
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

    const renderParameterInput = () => {
        if (parameterType.isNumber) {
            return (
                <Input
                    value={String(value ?? 0)}
                    onChange={handleNumber}
                    className="w-full bg-ui"
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
                    className="w-full bg-ui"
                    placeholder="Введите текст..."
                />
            );
        }

        if (parameterType.isBoolean) {
            return (
                <div className="flex items-center h-[36px]">
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
                    className="w-full"
                />
            );
        }

        if (parameterType.isArray) {
            if (!arrayData) return null;

            return (
                <div className="flex flex-col gap-2 w-full">
                    {arrayData.length === 0 && <p className="p-2 text-gray text-sm">Массив пуст</p>}

                    {arrayData.map((item, index) => {
                        const Icon = getDynamicIcon(item.type);

                        return (
                            <div key={item.id || index} className="flex items-center gap-2 bg-border rounded-md px-2 py-1">
                                <div className="flex items-center gap-2 w-full">
                                    <Icon size={16} />
                                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                </div>

                                {item.type === 'number' && (
                                    <Input
                                        value={String(item.value ?? 0)}
                                        onChange={(val) => {
                                            const num = parseFloat(val);
                                            handleArrayItem(item.id, isNaN(num) ? 0 : num, 'number');
                                        }}
                                        className="w-full bg-ui border border-ui-hover"
                                        inputMode="decimal"
                                    />
                                )}

                                {item.type === 'string' && (
                                    <Input
                                        value={String(item.value ?? '')}
                                        onChange={(val) => handleArrayItem(item.id, val, 'string')}
                                        className="w-full bg-ui border border-ui-hover"
                                        placeholder="Введите текст..."
                                    />
                                )}

                                {item.type === 'boolean' && (
                                    <div className="flex items-center w-full h-[36px]">
                                        <Checkbox
                                            checked={Boolean(item.value)}
                                            onChange={(checked) => handleArrayItem(item.id, checked, 'boolean')}
                                            className="bg-ui border border-ui-hover"
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
        <div className="flex flex-col gap-2 bg-card rounded-md py-2 px-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon size={16} />
                    <p className="text-sm font-medium text-foreground truncate">{name}</p>
                </div>

                <button
                    onClick={handleRemoveParameter}
                    className="text-gray cursor-pointer w-[36px] h-[36px] flex items-center justify-center"
                    title="Удалить параметр"
                >
                    <X size={16} />
                </button>
            </div>

            {renderParameterInput()}
        </div>
    );
});
