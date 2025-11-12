import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CanvasItem, Position, TooltipMode, Parameter } from '@/canvas/canvas.types';
import { NODE_MOVE_MIN_STEP, INITIAL_ZOOM } from '@/canvas/constants';

interface CanvasState {
    offset: Position;
    setOffset: (offset: Position) => void;

    zoomLevel: number;
    setZoomLevel: (zoom: number) => void;

    mousePosition: Position;
    setMousePosition: (pos: Position) => void;

    nodeMoveStep: number;
    setNodeMoveStep: (step: number) => void;

    invertY: boolean;
    setInvertY: (value: boolean) => void;

    // ---

    hoveredNodeId: string | null;
    setHoveredNodeId: (id: string | null) => void;

    tempEdge: { from: string; toPos: Position } | null;
    setTempEdge: (edge: { from: string; toPos: Position } | null) => void;

    // ---

    items: CanvasItem[];
    setItems: (items: CanvasItem[]) => void;

    savedItems: CanvasItem[];
    setSavedItems: (items: CanvasItem[]) => void;

    parameters: Parameter[];
    setParameters: (parameters: Parameter[]) => void;

    selectedItemIds: string[];
    setSelectedItemIds: (ids: string[]) => void;

    selectedItem: CanvasItem | null;

    // ---

    tooltipMode: TooltipMode;
    setTooltipMode: (mode: TooltipMode) => void;

    isFullScreen: boolean;
    toggleFullScreen: () => void;

    isMagnet: boolean;
    setIsMagnet: (value: boolean) => void;

    showGrid: boolean;
    toggleShowGrid: () => void;

    showAxes: boolean;
    toggleShowAxes: () => void;

    // ---

    activeTab: string;
    setActiveTab: (tabId: string) => void;

    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
}

export const useCanvasStore = create<CanvasState>()(
    persist(
        (set, get) => ({
            offset: { x: 0, y: 0 },
            setOffset: (offset) => set({ offset }),

            zoomLevel: INITIAL_ZOOM,
            setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

            mousePosition: { x: 0, y: 0 },
            setMousePosition: (mousePosition) => set({ mousePosition }),

            nodeMoveStep: NODE_MOVE_MIN_STEP,
            setNodeMoveStep: (step) => set({ nodeMoveStep: step }),

            invertY: true,
            setInvertY: (value) => set({ invertY: value }),

            // ---

            hoveredNodeId: null,
            setHoveredNodeId: (hoveredNodeId) => set({ hoveredNodeId }),

            tempEdge: null,
            setTempEdge: (tempEdge) => set({ tempEdge }),

            // ---

            items: [],
            setItems: (items) =>
                set({
                    items,
                    selectedItem:
                        get().selectedItemIds.length > 0
                            ? (items.find((item) => item.id === get().selectedItemIds[0]) ?? null)
                            : null,
                }),

            savedItems: [],
            setSavedItems: (items) => set({ savedItems: items }),

            parameters: [],
            setParameters: (parameters) => set({ parameters }),

            selectedItemIds: [],
            setSelectedItemIds: (ids) =>
                set({
                    selectedItemIds: ids,
                    selectedItem: ids.length > 0 ? (get().items.find((item) => item.id === ids[0]) ?? null) : null,
                }),

            selectedItem: null,

            // ---

            tooltipMode: 'always',
            setTooltipMode: (tooltipMode) => set({ tooltipMode }),

            isFullScreen: false,
            toggleFullScreen: () => set((s) => ({ isFullScreen: !s.isFullScreen })),

            isMagnet: false,
            setIsMagnet: (value) => set({ isMagnet: value }),

            showGrid: true,
            toggleShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),

            showAxes: false,
            toggleShowAxes: () => set((s) => ({ showAxes: !s.showAxes })),

            //  ---

            activeTab: '',
            setActiveTab: (activeTab) => set({ activeTab }),

            sidebarWidth: 380,
            setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
        }),
        {
            name: 'canvas-storage',
            partialize: (state) => ({
                offset: state.offset,
                zoomLevel: state.zoomLevel,
                nodeMoveStep: state.nodeMoveStep,
                invertY: state.invertY,

                // ---

                items: state.items,
                savedItems: state.savedItems,
                parameters: state.parameters,
                selectedItemIds: state.selectedItemIds,
                selectedItem: state.selectedItem,

                // ---

                tooltipMode: state.tooltipMode,
                isFullScreen: state.isFullScreen,
                isMagnet: state.isMagnet,
                showGrid: state.showGrid,
                showAxes: state.showAxes,

                //---

                activeTab: state.activeTab,
                sidebarWidth: state.sidebarWidth,
            }),
        },
    ),
);
