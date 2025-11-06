'use client';

import { memo } from 'react';

import { Input } from '@/components/UI/Input';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { EmptyState } from '@/components/UI/EmptyState';

import { ParametersItem } from '@/canvas/components/Parameters/ParametersItem';

import { useParameters } from '@/canvas/hooks/Parameters/useParameters';

import { getDynamicIcon } from '@/canvas/utils/canvas/getDynamicIcon';

import { Plus } from 'lucide-react';

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
        <div className="flex flex-col h-full">
            <div className="flex gap-1 items-center m-1">
                <Input value={name} onChange={setName} placeholder="Имя переменной" className="w-48" max={16} />

                <DropdownAbsolute
                    title={parameterTypes.find((parameterType) => parameterType.value === type)?.label || 'Тип'}
                    icon={getDynamicIcon(type)}
                >
                    {parameterTypes.map((parameterType) => {
                        const Icon = getDynamicIcon(parameterType.value);

                        return (
                            <button
                                key={parameterType.value}
                                onClick={() => setType(parameterType.value)}
                                className="px-3 py-2 w-full flex items-center gap-2 text-left bg-border hover:bg-ui rounded-md cursor-pointer"
                            >
                                <Icon size={16} className="min-w-4" />
                                <p className="w-max">{parameterType.label}</p>
                            </button>
                        );
                    })}
                </DropdownAbsolute>

                <button
                    onClick={addParameter}
                    className={`${name.length === 0 ? 'bg-card/50 text-foreground/50' : 'bg-card text-foreground'} flex items-center justify-center max-w-[36px] w-full h-[36px] rounded-md cursor-pointer`}
                    disabled={name.length === 0}
                >
                    <Plus size={16} />
                </button>
            </div>

            <hr className="border-b-0 border-border" />

            {parameters.length !== 0 && (
                <div className="flex flex-col gap-1 m-1">
                    {parameters.map((parameter) => (
                        <ParametersItem key={parameter.id} parameterId={parameter.id} onRemoveParameter={removeParameter} />
                    ))}
                </div>
            )}

            {parameters.length === 0 && <EmptyState message="Создайте переменную для использования в инспекторе" />}
        </div>
    );
});
