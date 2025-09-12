import { create } from 'zustand';
import { CanvasItem } from '@/canvas/canvas.types';
import { NODE_MOVE_MIN_STEP } from '@/canvas/constants';

interface CanvasState {
    items: CanvasItem[];
    setItems: (items: CanvasItem[]) => void;

    selectedItemIds: string[];
    setSelectedItemIds: (ids: string[]) => void;

    tempEdge: { from: string; toPos: { x: number; y: number } } | null;
    setTempEdge: (edge: { from: string; toPos: { x: number; y: number } } | null) => void;

    nodeMoveStep: number;
    setNodeMoveStep: (step: number) => void;

    isMagnet: boolean;
    setIsMagnet: (value: boolean) => void;

    showGrid: boolean;
    toggleShowGrid: () => void;

    showAxes: boolean;
    toggleShowAxes: () => void;

    inspectorItem: CanvasItem | null;
    setInspectorItem: (item: CanvasItem | null) => void;

    breadcrumbs: { label: string }[];
    setBreadcrumbs: (breadcrumbs: { label: string }[]) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    items: [],
    setItems: (items: CanvasItem[]) => set({ items }),

    selectedItemIds: [],
    setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),

    tempEdge: null,
    setTempEdge: (tempEdge) => set({ tempEdge }),

    nodeMoveStep: NODE_MOVE_MIN_STEP,
    setNodeMoveStep: (step) => set({ nodeMoveStep: step }),

    isMagnet: false,
    setIsMagnet: (value) => set({ isMagnet: value }),

    showGrid: true,
    toggleShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),

    showAxes: false,
    toggleShowAxes: () => set((s) => ({ showAxes: !s.showAxes })),

    inspectorItem: null,
    setInspectorItem: (item) => set({ inspectorItem: item }),

    breadcrumbs: [{ label: 'Канвас' }],
    setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));
