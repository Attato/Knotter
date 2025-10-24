import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Parameter } from '@/canvas/canvas.types';

interface ParametersState {
    parameters: Parameter[];
    setParameters: (parameters: Parameter[]) => void;
}

export const useParametersStore = create<ParametersState>()(
    persist(
        (set) => ({
            parameters: [],
            setParameters: (parameters) => set({ parameters }),
        }),
        {
            name: 'parameters-storage',
        },
    ),
);
