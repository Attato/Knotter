import { useCanvasStore } from '@/canvas/store/canvasStore';

export function getScrollEventHandler() {
    return (e: WheelEvent) => {
        if (e.ctrlKey) return;
        e.preventDefault();

        const dx = e.shiftKey ? e.deltaY : 0;
        const dy = !e.shiftKey ? e.deltaY : 0;

        const { offset, setOffset, invertY } = useCanvasStore.getState();

        setOffset({
            x: offset.x - dx,
            y: offset.y - (invertY ? -dy : dy),
        });
    };
}
