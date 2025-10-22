import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Variable } from '@/canvas/canvas.types';

interface ParametersState {
    variables: Variable[];
    setVariables: (variables: Variable[]) => void;
}

export const useParametersStore = create<ParametersState>()(
    persist(
        (set) => ({
            variables: [],
            setVariables: (variables) => set({ variables }),
        }),
        {
            name: 'parameters-storage',
        },
    ),
);
