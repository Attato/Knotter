import { create } from 'zustand';
import { Node } from '@/canvas/canvas.types';

interface CanvasState {
    nodes: Node[];
    selectedNodeIds: number[];
    setNodes: (nodes: Node[]) => void;
    setSelectedNodeIds: (ids: number[]) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    nodes: [],
    setNodes: (nodes) => set({ nodes }),

    selectedNodeIds: [],
    setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),
}));
