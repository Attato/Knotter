import { create } from 'zustand';
import { Position, Node, Edge } from '@/canvas/canvas.types';

interface CanvasState {
    nodes: Node[];
    setNodes: (nodes: Node[]) => void;

    isMagnet: boolean;
    setIsMagnet: () => void;

    selectedNodeIds: string[];
    setSelectedNodeIds: (ids: string[]) => void;

    edges: Edge[];
    setEdges: (edges: Edge[]) => void;

    tempEdge: { from: string; toPos: Position } | null;
    setTempEdge: (edge: { from: string; toPos: Position } | null) => void;

    showGrid: boolean;
    setShowGrid: () => void;

    showAxes: boolean;
    setShowAxes: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    nodes: [],
    setNodes: (nodes) => set({ nodes }),

    isMagnet: false,
    setIsMagnet: () => set((s) => ({ isMagnet: !s.isMagnet })),

    selectedNodeIds: [],
    setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),

    edges: [],
    setEdges: (edges) => set({ edges }),

    tempEdge: null,
    setTempEdge: (tempEdge) => set({ tempEdge }),

    showGrid: true,
    setShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),

    showAxes: false,
    setShowAxes: () => set((s) => ({ showAxes: !s.showAxes })),
}));
