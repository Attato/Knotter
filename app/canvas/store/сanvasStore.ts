import { create } from 'zustand';
import { Position, Node, Edge } from '@/canvas/canvas.types';
import { NODE_MOVE_MIN_STEP } from '@/canvas/constants';

interface CanvasState {
    nodes: Node[];
    setNodes: (nodes: Node[]) => void;

    nodeMoveStep: number;
    setNodeMoveStep: (step: number) => void;

    selectedNodeIds: string[];
    setSelectedNodeIds: (ids: string[]) => void;

    edges: Edge[];
    setEdges: (edges: Edge[]) => void;

    tempEdge: { from: string; toPos: Position } | null;
    setTempEdge: (edge: { from: string; toPos: Position } | null) => void;

    isMagnet: boolean;
    setIsMagnet: (value: boolean) => void;

    showGrid: boolean;
    setShowGrid: (value: boolean) => void;

    showAxes: boolean;
    setShowAxes: (value: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    nodes: [],
    setNodes: (nodes) => set({ nodes }),

    nodeMoveStep: NODE_MOVE_MIN_STEP,
    setNodeMoveStep: (step) => set({ nodeMoveStep: step }),

    selectedNodeIds: [],
    setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),

    edges: [],
    setEdges: (edges) => set({ edges }),

    tempEdge: null,
    setTempEdge: (tempEdge) => set({ tempEdge }),

    isMagnet: false,
    setIsMagnet: (value) => set({ isMagnet: value }),

    showGrid: true,
    setShowGrid: () => set((s) => ({ showGrid: !s.showGrid })),

    showAxes: false,
    setShowAxes: () => set((s) => ({ showAxes: !s.showAxes })),
}));
