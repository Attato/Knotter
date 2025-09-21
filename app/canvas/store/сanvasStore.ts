import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CanvasItem, Position } from '@/canvas/canvas.types';
import { NODE_MOVE_MIN_STEP, INITIAL_ZOOM } from '@/canvas/constants';

interface CanvasState {
    items: CanvasItem[];
    setItems: (items: CanvasItem[]) => void;

    selectedItemIds: string[];
    setSelectedItemIds: (ids: string[]) => void;

    tempEdge: { from: string; toPos: Position } | null;
    setTempEdge: (edge: { from: string; toPos: Position } | null) => void;

    nodeMoveStep: number;
    setNodeMoveStep: (step: number) => void;

    offset: Position;
    setOffset: (offset: Position) => void;

    zoomLevel: number;
    setZoomLevel: (zoom: number) => void;

    isMagnet: boolean;
    setIsMagnet: (value: boolean) => void;

    showGrid: boolean;
    toggleShowGrid: () => void;

    showAxes: boolean;
    toggleShowAxes: () => void;

    invertY: boolean;
    setInvertY: (value: boolean) => void;

    mousePosition: Position;
    setMousePosition: (pos: Position) => void;

    inspectorItem: CanvasItem | null;
    setInspectorItem: (item: CanvasItem | null) => void;
}

export const useCanvasStore = create<CanvasState>()(
    persist(
        (set) => ({
            items: [],
            setItems: (items) => set({ items }),

            selectedItemIds: [],
            setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),

            tempEdge: null,
            setTempEdge: (tempEdge) => set({ tempEdge }),

            nodeMoveStep: NODE_MOVE_MIN_STEP,
            setNodeMoveStep: (step) => set({ nodeMoveStep: step }),

            offset: { x: 0, y: 0 },
            setOffset: (offset) => set({ offset }),

            zoomLevel: INITIAL_ZOOM,
            setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

            isMagnet: false,
            setIsMagnet: (value) => set({ isMagnet: value }),

            showGrid: true,
            toggleShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),

            showAxes: false,
            toggleShowAxes: () => set((s) => ({ showAxes: !s.showAxes })),

            invertY: true,
            setInvertY: (value) => set({ invertY: value }),

            mousePosition: { x: 0, y: 0 },
            setMousePosition: (pos) => set({ mousePosition: pos }),

            inspectorItem: null,
            setInspectorItem: (item) => set({ inspectorItem: item }),
        }),
        {
            name: 'canvas-storage',
            partialize: (state) => ({
                items: state.items,
                selectedItemIds: state.selectedItemIds,
                nodeMoveStep: state.nodeMoveStep,
                offset: state.offset,
                zoomLevel: state.zoomLevel,
                isMagnet: state.isMagnet,
                showGrid: state.showGrid,
                showAxes: state.showAxes,
                invertY: state.invertY,
            }),
        },
    ),
);
