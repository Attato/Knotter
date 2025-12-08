'use client';

import { memo } from 'react';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

import { isNumberValue, isStringValue, isBooleanValue } from '@/canvas/hooks/Parameters/useParametersItem';
import { ParameterValue } from '@/canvas/canvas.types';

import { X } from 'lucide-react';

interface BaseParameterContentProps {
    parameterId: string;
    parameterName: string;
    parameterType: string;
    parameterValue: ParameterValue;

    updateParameterName: (name: string) => void;
    updateParameter: (value: ParameterValue) => void;

    handleBaseNumberInput: (value: string) => void;
    handleMinNumberInput: (value: string) => void;
    handleMaxNumberInput: (value: string) => void;
    handleStepNumberInput: (value: string) => void;

    getDisplayValue: (field: 'base' | 'min' | 'max' | 'step') => string;

    onRemove: () => void;
}

export const BaseParameterContent = memo(function BaseParameterContent({
    parameterId,
    parameterName,
    parameterType,
    parameterValue,

    updateParameterName,
    updateParameter,

    handleBaseNumberInput,
    handleMinNumberInput,
    handleMaxNumberInput,
    handleStepNumberInput,
    getDisplayValue,

    onRemove,
}: BaseParameterContentProps) {
    const Icon = getDynamicIcon(parameterType);

    return (
        <div
            className="flex flex-col justify-center gap-2 px-3 py-1 text-sm bg-depth-2 rounded-md"
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('application/parameter-id', parameterId);
                e.dataTransfer.setData('application/parameter-type', parameterType);
            }}
        >
            <div className="flex items-center gap-1 h-8">
                <Icon size={16} className="min-w-4" />

                <EditableName name={parameterName} onChange={updateParameterName} className="w-full" />

                <button onClick={onRemove} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            <div className="flex items-center gap-1">
                {isNumberValue(parameterValue) && (
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2">
                            <p className="truncate w-full text-right">Базовое значение</p>

                            <Input
                                value={getDisplayValue('base')}
                                onChange={handleBaseNumberInput}
                                className="bg-depth-3 border border-depth-4"
                                max={16}
                                type="text"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="truncate w-full text-right">Минимальное значение</p>

                            <Input
                                value={getDisplayValue('min')}
                                onChange={handleMinNumberInput}
                                className="bg-depth-3 border border-depth-4"
                                max={16}
                                type="text"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="truncate w-full text-right">Максимальное значение</p>

                            <Input
                                value={getDisplayValue('max')}
                                onChange={handleMaxNumberInput}
                                className="bg-depth-3 border border-depth-4"
                                max={16}
                                type="text"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="truncate w-full text-right">Шаг изменения</p>

                            <Input
                                value={getDisplayValue('step')}
                                onChange={handleStepNumberInput}
                                className="bg-depth-3 border border-depth-4"
                                max={16}
                                type="text"
                                placeholder="1"
                            />
                        </div>
                    </div>
                )}

                {isStringValue(parameterValue) && (
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2">
                            <p className="truncate w-full text-right">Базовое значение</p>

                            <Input
                                value={parameterValue}
                                onChange={(val) => updateParameter(val)}
                                className="bg-depth-3 border border-depth-4"
                                max={16}
                                placeholder="Введите текст..."
                            />
                        </div>
                    </div>
                )}

                {isBooleanValue(parameterValue) && (
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2">
                            <p className="truncate w-full text-right">Базовое значение</p>
                            <div className="w-full">
                                <Checkbox
                                    checked={parameterValue}
                                    onChange={(checked) => updateParameter(checked)}
                                    className="bg-depth-3 border border-depth-4"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
