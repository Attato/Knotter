import { CanvasItem } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export const openInspector = (item: CanvasItem) => {
    const { setInspectorItem, setBreadcrumbs } = useCanvasStore.getState();

    setInspectorItem(item);
    setBreadcrumbs([{ label: 'Канвас' }, { label: item.name }]);
};
