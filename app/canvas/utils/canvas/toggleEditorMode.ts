import { useCanvasStore } from '@/canvas/store/canvasStore';

export function toggleEditorMode() {
    const editorMode = useCanvasStore.getState().editorMode;
    const setEditorMode = useCanvasStore.getState().setEditorMode;

    const modes = ['edit', 'view'] as const;
    const currentIndex = modes.indexOf(editorMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setEditorMode(modes[nextIndex]);
}
