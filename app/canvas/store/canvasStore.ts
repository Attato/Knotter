import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CanvasItem, Position, TooltipMode } from '@/canvas/canvas.types';
import { NODE_MOVE_MIN_STEP, INITIAL_ZOOM } from '@/canvas/constants';

interface CanvasState {
    items: CanvasItem[];
    setItems: (items: CanvasItem[]) => void;

    savedItems: CanvasItem[];
    setSavedItems: (items: CanvasItem[]) => void;

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

    isFullScreen: boolean;
    toggleFullScreen: () => void;

    tooltipMode: TooltipMode;
    setTooltipMode: (mode: TooltipMode) => void;

    invertY: boolean;
    setInvertY: (value: boolean) => void;

    mousePosition: Position;
    setMousePosition: (pos: Position) => void;

    hoveredNodeId: string | null;
    setHoveredNodeId: (id: string | null) => void;

    activeTab: string;
    setActiveTab: (tabId: string) => void;
}

export const useCanvasStore = create<CanvasState>()(
    persist(
        (set) => ({
            items: [],
            setItems: (items) => set({ items }),

            savedItems: [],
            setSavedItems: (items) => set({ savedItems: items }),

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

            isFullScreen: false,
            toggleFullScreen: () => set((s) => ({ isFullScreen: !s.isFullScreen })),

            tooltipMode: 'always',
            setTooltipMode: (tooltipMode) => set({ tooltipMode }),

            invertY: true,
            setInvertY: (value) => set({ invertY: value }),

            mousePosition: { x: 0, y: 0 },
            setMousePosition: (mousePosition) => set({ mousePosition }),

            hoveredNodeId: null,
            setHoveredNodeId: (hoveredNodeId) => set({ hoveredNodeId }),

            activeTab: '',
            setActiveTab: (activeTab) => set({ activeTab }),
        }),
        {
            name: 'canvas-storage',
            partialize: (state) => ({
                items: state.items,
                savedItems: state.savedItems,
                selectedItemIds: state.selectedItemIds,
                nodeMoveStep: state.nodeMoveStep,
                offset: state.offset,
                zoomLevel: state.zoomLevel,
                isMagnet: state.isMagnet,
                showGrid: state.showGrid,
                showAxes: state.showAxes,
                isFullScreen: state.isFullScreen,
                tooltipMode: state.tooltipMode,
                invertY: state.invertY,
                activeTab: state.activeTab,
            }),
        },
    ),
);
