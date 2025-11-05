'use client';

import { memo } from 'react';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { useParametersItem } from '@/canvas/hooks/Parameters/useParametersItem';
import { useDynamicIcon } from '@/canvas/hooks/useDynamicIcon';

import { isNumberValue, isStringValue, isBooleanValue, isEnumValue } from '@/canvas/hooks/Parameters/useParametersItem';

import { X } from 'lucide-react';

interface ParametersItemProps {
    parameterId: string;
    onRemoveParameter: (id: string) => void;
}

export const ParametersItem = memo(function ParametersItem({ parameterId, onRemoveParameter }: ParametersItemProps) {
    const {
        parameter,
        parameterType,
        updateParameter,
        updateParameterName,
        updateEnumOption,
        addEnumOption,
        removeEnumOption,
        handleNumberInput,
        getDisplayValue,
    } = useParametersItem(parameterId);

    const Icon = useDynamicIcon(parameterType);
    const parameterValue = parameter.value;

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-2 min-h-[44px] text-sm bg-card rounded-md">
            <div className="flex items-center gap-1 h-[36px]">
                <Icon size={16} className="min-w-4" />

                <EditableName name={parameter.name} onChange={updateParameterName} className="w-full" />

                {isNumberValue(parameterValue) && (
                    <Input
                        value={getDisplayValue()}
                        onChange={handleNumberInput}
                        className="bg-ui w-24"
                        max={16}
                        type="text"
                        inputMode="decimal"
                    />
                )}

                {isStringValue(parameterValue) && (
                    <Input
                        value={parameterValue}
                        onChange={(val) => updateParameter(val)}
                        className="bg-ui w-48"
                        max={16}
                        placeholder="Введите текст..."
                    />
                )}

                {isBooleanValue(parameterValue) && (
                    <div className="w-full">
                        <Checkbox checked={parameterValue} onChange={(checked) => updateParameter(checked)} />
                    </div>
                )}

                <button onClick={() => onRemoveParameter(parameter.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            {isEnumValue(parameterValue) && (
                <div className="flex flex-col gap-1 ml-32">
                    {parameterValue.options.values.map((opt: string, idx: number) => {
                        const isSingleOption = parameterValue.options.values.length === 1;

                        return (
                            <div key={idx} className="flex gap-1 items-center">
                                <p className="tabular-nums min-w-[4ch]">{idx + 1}.</p>

                                <Input
                                    value={opt}
                                    onChange={(val) => updateEnumOption(idx, val)}
                                    className="bg-ui w-48"
                                    max={16}
                                />

                                <button
                                    onClick={() => removeEnumOption(idx)}
                                    className={`${isSingleOption ? 'text-gray/50' : 'text-gray'} cursor-pointer`}
                                    disabled={isSingleOption}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        );
                    })}

                    <button
                        onClick={addEnumOption}
                        className="text-sm bg-ui hover:bg-ui-hover rounded-md px-3 py-2 cursor-pointer mr-5"
                    >
                        + Добавить опцию
                    </button>
                </div>
            )}
        </div>
    );
});
