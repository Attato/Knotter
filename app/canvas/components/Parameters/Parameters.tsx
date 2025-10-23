'use client';

import { memo } from 'react';

import { Input } from '@/components/UI/Input';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';

import { useParameters } from '@/canvas/hooks/Parameters/useParameters';

import { Plus } from 'lucide-react';
import { ParametersItem } from './ParametersItem';

export const Parameters = memo(function Parameters() {
    const {
        name,
        type,
        variables,
        variableTypes,

        setName,
        setType,

        addVariable,
        removeVariable,
    } = useParameters();

    return (
        <div className="flex flex-col">
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
                    className={`${name.length === 0 ? 'bg-bg-accent/50 text-white/50' : 'bg-bg-accent text-white'} flex items-center justify-center max-w-[36px] w-full h-[36px] rounded-md cursor-pointer`}
                    disabled={name.length === 0}
                >
                    <Plus size={16} />
                </button>
            </div>

            <hr className="border-b-0 border-border" />

            <div className="flex flex-col gap-1 m-1">
                {variables.map((variable) => (
                    <ParametersItem key={variable.id} variableId={variable.id} onRemoveVariable={removeVariable} />
                ))}
            </div>
        </div>
    );
});
