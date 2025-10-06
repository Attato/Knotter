import { CanvasItem } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export const handleItemNameChange = (item: CanvasItem, newName: string) => {
    useCanvasStore.setState((state) => ({
        items: state.items.map((i) => (i.id === item.id && i.name !== newName ? { ...i, name: newName } : i)),
    }));
};
