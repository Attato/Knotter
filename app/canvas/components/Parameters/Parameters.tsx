'use client';

import { useState, memo } from 'react';
import { v4 as uuid } from 'uuid';

import { Input } from '@/components/UI/Input';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';
import { EditableName } from '@/components/UI/EditableName';

import { Plus, X } from 'lucide-react';

type Enum = string[];
type VariableType = 'number' | 'string' | 'boolean' | 'enum';
type VariableValue = number | string | boolean | Enum;

interface Variable {
    id: string;
    name: string;
    type: VariableType;
    value: VariableValue;
}

const VARIABLE_TYPES: { label: string; value: VariableType }[] = [
    { label: 'Число', value: 'number' },
    { label: 'Строка', value: 'string' },
    { label: 'Логическое выражение', value: 'boolean' },
    { label: 'Перечисление', value: 'enum' },
];

const NUMBER_LIMITS = {
    MIN: -999999999,
    MAX: 999999999,
    STEP: 1,
};

export const Parameters = memo(function Parameters() {
    const [variables, setVariables] = useState<Variable[]>([]);
    const [name, setName] = useState('');
    const [type, setType] = useState<VariableType>('number');

    const createInitialValue = (type: VariableType) => {
        switch (type) {
            case 'number':
                return 0;
            case 'string':
                return '';
            case 'boolean':
                return false;
            case 'enum':
                return ['Первая опция'] as Enum;
        }
    };

    const addVariable = () => {
        if (!name) return;

        const newVar: Variable = {
            id: uuid(),
            name,
            type,
            value: createInitialValue(type),
        };

        setVariables([...variables, newVar]);
        setName('');
    };

    const updateVariable = (id: string, value: VariableValue) => {
        setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, value } : v)));
    };

    const updateVariableName = (id: string, newName: string) => {
        setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, name: newName } : v)));
    };

    const modifyEnum = (varId: string, modifier: (arr: Enum) => Enum) => {
        setVariables((prev) =>
            prev.map((v) => (v.id === varId && v.type === 'enum' ? { ...v, value: modifier(v.value as Enum) } : v)),
        );
    };

    const updateEnumOption = (varId: string, index: number, newValue: string) =>
        modifyEnum(varId, (arr) => {
            const copy = [...arr];
            copy[index] = newValue;
            return copy;
        });

    const addEnumOption = (varId: string) => modifyEnum(varId, (arr) => [...arr, '']);
    const removeEnumOption = (varId: string, index: number) => modifyEnum(varId, (arr) => arr.filter((_, i) => i !== index));

    const handleNumberInput = (value: string, variableId: string) => {
        if (value === '' || value === '-' || value === '-.') {
            updateVariable(variableId, 0);
            return;
        }

        if (!/^-?\d*\.?\d*$/.test(value)) {
            return;
        }

        if (value.endsWith('.') || value === '-.' || (value.startsWith('-') && value.endsWith('.'))) {
            updateVariable(variableId, 0);
            return;
        }

        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            updateVariable(variableId, 0);
            return;
        }

        if (numValue < NUMBER_LIMITS.MIN) {
            updateVariable(variableId, NUMBER_LIMITS.MIN);
        } else if (numValue > NUMBER_LIMITS.MAX) {
            updateVariable(variableId, NUMBER_LIMITS.MAX);
        } else {
            updateVariable(variableId, numValue);
        }
    };

    const getDisplayValue = (variable: Variable): string => {
        if (variable.type !== 'number') return String(variable.value);

        return variable.value.toString();
    };

    return (
        <div className=" flex flex-col">
            <div className="flex gap-1 items-center m-1">
                <Input value={name} onChange={setName} placeholder="Имя переменной" className="w-48" max={16} />

                <DropdownAbsolute title={VARIABLE_TYPES.find((v) => v.value === type)?.label || 'Тип'}>
                    {VARIABLE_TYPES.map((v) => (
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
                                <input
                                    type="checkbox"
                                    checked={variable.value as boolean}
                                    onChange={(e) => updateVariable(variable.id, e.target.checked)}
                                    className="h-5 w-5"
                                />
                            )}

                            <button
                                onClick={() => setVariables((prev) => prev.filter((v) => v.id !== variable.id))}
                                className="ml-auto text-gray cursor-pointer"
                            >
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
