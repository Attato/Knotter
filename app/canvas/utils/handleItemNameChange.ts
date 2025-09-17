import { CanvasItem } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export const handleItemNameChange = (item: CanvasItem, newName: string) => {
    const { items, setItems } = useCanvasStore.getState();

    const updatedItems = items.map((i) => (i.id === item.id ? { ...i, name: newName } : i));
    setItems(updatedItems);
};
