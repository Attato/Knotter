import { create } from 'zustand';
import { CanvasItem } from '@/canvas/canvas.types';
import { NODE_MOVE_MIN_STEP } from '@/canvas/constants';

interface CanvasState {
    items: CanvasItem[];
    setItems: (items: CanvasItem[]) => void;

    nodeMoveStep: number;
    setNodeMoveStep: (step: number) => void;

    selectedItemIds: string[];
    setSelectedItemIds: (ids: string[]) => void;

    tempEdge: { from: string; toPos: { x: number; y: number } } | null;
    setTempEdge: (edge: { from: string; toPos: { x: number; y: number } } | null) => void;

    isMagnet: boolean;
    setIsMagnet: (value: boolean) => void;

    showGrid: boolean;
    toggleShowGrid: () => void;

    showAxes: boolean;
    toggleShowAxes: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    items: [],
    setItems: (items: CanvasItem[]) => set({ items }),

    nodeMoveStep: NODE_MOVE_MIN_STEP,
    setNodeMoveStep: (step) => set({ nodeMoveStep: step }),

    selectedItemIds: [],
    setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),

    tempEdge: null,
    setTempEdge: (tempEdge) => set({ tempEdge }),

    isMagnet: false,
    setIsMagnet: (value) => set({ isMagnet: value }),

    showGrid: true,
    toggleShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),

    showAxes: false,
    toggleShowAxes: () => set((s) => ({ showAxes: !s.showAxes })),
}));
