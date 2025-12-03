import { useCanvasStore } from '@/canvas/store/canvasStore';

export function getScrollEventHandler() {
    return (e: WheelEvent) => {
        if (e.ctrlKey) return;

        if (shouldSkipCanvasScroll(e.target as HTMLElement)) {
            return;
        }

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

function shouldSkipCanvasScroll(startElement: HTMLElement | null): boolean {
    let element = startElement;

    while (element && element !== document.body) {
        if (element.hasAttribute('data-no-canvas-scroll')) {
            return true;
        }

        element = element.parentElement;
    }

    return false;
}
