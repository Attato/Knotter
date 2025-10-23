'use client';

import { memo } from 'react';

import { Enum } from '@/canvas/canvas.types';

import { Input } from '@/components/UI/Input';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { EditableName } from '@/components/UI/EditableName';
import { Checkbox } from '@/components/UI/Checkbox';

import { useParameters } from '@/canvas/hooks/Parameters/useParameters';

import { Plus, X } from 'lucide-react';

export const Parameters = memo(function Parameters() {
    const {
        name,
        type,
        variables,
        variableTypes,

        setName,
        setType,

        addVariable,
        updateVariable,
        updateVariableName,
        updateEnumOption,
        addEnumOption,
        removeEnumOption,
        handleNumberInput,
        getDisplayValue,
        removeVariable,
    } = useParameters();

    return (
        <div className=" flex flex-col">
            <div className="flex gap-1 items-center m-1">
                <Input value={name} onChange={setName} placeholder="Имя переменной" className="w-48" max={16} />

                <DropdownAbsolute title={variableTypes.find((v) => v.value === type)?.label || 'Тип'}>
                    {variableTypes.map((v) => (
                        <button
                            key={v.value}
                            onClick={() => setType(v.value)}
                            className="px-3 py-2 w-full flex justify-between bg-border hover:bg-ui rounded-md cursor-pointer"
                        >
                            {v.label}
                        </button>
                    ))}
                </DropdownAbsolute>

                <button
                    onClick={addVariable}
                    className={`${name.length === 0 ? 'bg-bg-accent/50 text-white/50' : 'bg-bg-accent text-white'} flex  items-center justify-center max-w-[36px] w-full h-[36px]  rounded-md cursor-pointer`}
                    disabled={name.length === 0}
                >
                    <Plus size={16} />
                </button>
            </div>

            <hr className="border-b-0 border-border" />

            <div className="flex flex-col gap-1 m-1">
                {variables.map((variable) => (
                    <div
                        key={variable.id}
                        className="flex flex-col justify-center gap-2 px-3 py-1 min-h-[44px] text-sm bg-card rounded-md"
                    >
                        <div className="flex items-center gap-2">
                            <EditableName
                                name={variable.name}
                                onChange={(newName) => updateVariableName(variable.id, newName)}
                                className="w-full"
                            />

                            {variable.type === 'number' ? (
                                <Input
                                    value={getDisplayValue(variable)}
                                    onChange={(val) => handleNumberInput(val, variable.id)}
                                    className="bg-ui w-24"
                                    max={16}
                                    type="text"
                                    inputMode="decimal"
                                />
                            ) : variable.type === 'string' ? (
                                <Input
                                    value={String(variable.value)}
                                    onChange={(val) => updateVariable(variable.id, val)}
                                    className="bg-ui w-48"
                                    max={16}
                                />
                            ) : null}

                            {variable.type === 'boolean' && (
                                <Checkbox
                                    checked={variable.value as boolean}
                                    onChange={(checked) => updateVariable(variable.id, checked)}
                                />
                            )}

                            <button onClick={() => removeVariable(variable.id)} className="ml-auto text-gray cursor-pointer">
                                <X size={16} />
                            </button>
                        </div>

                        {variable.type === 'enum' && (
                            <div className="flex flex-col gap-1 ml-32">
                                {(variable.value as Enum).map((opt, idx) => (
                                    <div key={idx} className="flex gap-1 items-center">
                                        <Input
                                            value={opt}
                                            onChange={(val) => updateEnumOption(variable.id, idx, val)}
                                            className="bg-ui w-48"
                                            max={16}
                                        />

                                        <button
                                            onClick={() => removeEnumOption(variable.id, idx)}
                                            className={`${(variable.value as Enum).length === 1 ? 'text-gray/50' : 'text-gray'}`}
                                            disabled={(variable.value as Enum).length === 1}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={() => addEnumOption(variable.id)}
                                    className="text-sm bg-ui hover:bg-ui-hover rounded-md px-3 py-1 cursor-pointer mr-5"
                                >
                                    + Добавить опцию
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});
