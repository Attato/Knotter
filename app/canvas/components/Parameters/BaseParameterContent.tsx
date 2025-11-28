'use client';

import { memo } from 'react';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';

import { isNumberValue, isStringValue, isBooleanValue } from '@/canvas/hooks/Parameters/useParametersItem';

import { X } from 'lucide-react';

type BaseParameterValue = number | string | boolean;

interface BaseParameterContentProps {
    parameterId: string;
    parameterName: string;
    parameterType: string;
    parameterValue: BaseParameterValue;

    updateParameterName: (name: string) => void;
    updateParameter: (value: BaseParameterValue) => void;
    handleNumberInput: (value: string) => void;
    getDisplayValue: () => string;

    onRemove: () => void;
}

export const BaseParameterContent = memo(function BaseParameterContent({
    parameterId,
    parameterName,
    parameterType,
    parameterValue,

    updateParameterName,
    updateParameter,
    handleNumberInput,
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
            <div className="flex items-center gap-1">
                <Icon size={16} className="min-w-4" />

                <EditableName name={parameterName} onChange={updateParameterName} className="w-full" />

                {isNumberValue(parameterValue) && (
                    <Input
                        value={getDisplayValue()}
                        onChange={handleNumberInput}
                        className="bg-depth-3 border border-depth-4"
                        max={16}
                        type="text"
                        inputMode="decimal"
                    />
                )}

                {isStringValue(parameterValue) && (
                    <Input
                        value={parameterValue}
                        onChange={(val) => updateParameter(val)}
                        className="bg-depth-3 border border-depth-4"
                        max={16}
                        placeholder="Введите текст..."
                    />
                )}

                {isBooleanValue(parameterValue) && (
                    <div className="w-full">
                        <Checkbox
                            checked={parameterValue}
                            onChange={(checked) => updateParameter(checked)}
                            className="bg-depth-3 border border-depth-4"
                        />
                    </div>
                )}

                <button onClick={onRemove} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
});
