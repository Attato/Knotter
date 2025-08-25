import { create } from 'zustand';
import { Position, Node, Edge } from '@/canvas/canvas.types';

interface CanvasState {
    nodes: Node[];
    selectedNodeIds: number[];
    edges: Edge[];
    setNodes: (nodes: Node[]) => void;
    setSelectedNodeIds: (ids: number[]) => void;
    setEdges: (edges: Edge[]) => void;
    tempEdge: { from: number; toPos: Position } | null;
    setTempEdge: (edge: { from: number; toPos: Position } | null) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    nodes: [],
    setNodes: (nodes) => set({ nodes }),

    selectedNodeIds: [],
    setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),

    edges: [],
    setEdges: (edges) => set({ edges }),

    tempEdge: null,
    setTempEdge: (tempEdge) => set({ tempEdge }),
}));
