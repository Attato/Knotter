'use client';

import { memo } from 'react';

import { Input } from '@/components/UI/Input';
import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { useParametersItem } from '@/canvas/hooks/Parameters/useParametersItem';

import { X } from 'lucide-react';

interface ParametersItemProps {
    variableId: string;
    onRemoveVariable: (id: string) => void;
}

export const ParametersItem = memo(function ParametersItem({ variableId, onRemoveVariable }: ParametersItemProps) {
    const {
        variable,
        updateVariable,
        updateVariableName,
        updateEnumOption,
        addEnumOption,
        removeEnumOption,
        handleNumberInput,
        getDisplayValue,
    } = useParametersItem(variableId);

    return (
        <div className="flex flex-col justify-center gap-2 px-3 py-1 min-h-[44px] text-sm bg-card rounded-md">
            <div className="flex items-center gap-2">
                <EditableName name={variable.name} onChange={updateVariableName} className="w-full" />

                {variable.type === 'number' ? (
                    <Input
                        value={getDisplayValue()}
                        onChange={handleNumberInput}
                        className="bg-ui w-24"
                        max={16}
                        type="text"
                        inputMode="decimal"
                    />
                ) : variable.type === 'string' ? (
                    <Input value={String(variable.value)} onChange={updateVariable} className="bg-ui w-48" max={16} />
                ) : null}

                {variable.type === 'boolean' && <Checkbox checked={variable.value as boolean} onChange={updateVariable} />}

                <button onClick={() => onRemoveVariable(variable.id)} className="ml-auto text-gray cursor-pointer">
                    <X size={16} />
                </button>
            </div>

            {variable.type === 'enum' && (
                <div className="flex flex-col gap-1 ml-32">
                    {(variable.value as string[]).map((opt, idx) => (
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
                                className={`${(variable.value as string[]).length === 1 ? 'text-gray/50' : 'text-gray'} cursor-pointer`}
                                disabled={(variable.value as string[]).length === 1}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addEnumOption}
                        className="text-sm bg-ui hover:bg-ui-hover rounded-md px-3 py-1 cursor-pointer mr-5"
                    >
                        + Добавить опцию
                    </button>
                </div>
            )}
        </div>
    );
});
