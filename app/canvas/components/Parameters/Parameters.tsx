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
        parameters,
        parameterTypes,

        setName,
        setType,

        addParameter,
        removeParameter,
    } = useParameters();

    return (
        <div className="flex flex-col">
            <div className="flex gap-1 items-center m-1">
                <Input value={name} onChange={setName} placeholder="Имя переменной" className="w-48" max={16} />

                <DropdownAbsolute
                    title={parameterTypes.find((parameterType) => parameterType.value === type)?.label || 'Тип'}
                >
                    {parameterTypes.map((parameterType) => (
                        <button
                            key={parameterType.value}
                            onClick={() => setType(parameterType.value)}
                            className="px-3 py-2 w-full flex justify-between bg-border hover:bg-ui rounded-md cursor-pointer"
                        >
                            {parameterType.label}
                        </button>
                    ))}
                </DropdownAbsolute>

                <button
                    onClick={addParameter}
                    className={`${name.length === 0 ? 'bg-card/50 text-white/50' : 'bg-card text-white'} flex items-center justify-center max-w-[36px] w-full h-[36px] rounded-md cursor-pointer`}
                    disabled={name.length === 0}
                >
                    <Plus size={16} />
                </button>
            </div>

            <hr className="border-b-0 border-border" />

            <div className="flex flex-col gap-1 m-1">
                {parameters.map((parameter) => (
                    <ParametersItem key={parameter.id} parameterId={parameter.id} onRemoveParameter={removeParameter} />
                ))}

                {parameters.length === 0 && <div className="p-2 text-gray text-sm text-center">Ничего не найдено</div>}
            </div>
        </div>
    );
});
