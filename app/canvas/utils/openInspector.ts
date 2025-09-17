import { CanvasItem } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export const openInspector = (item: CanvasItem) => {
    const { setInspectorItem } = useCanvasStore.getState();

    setInspectorItem(item);
};
