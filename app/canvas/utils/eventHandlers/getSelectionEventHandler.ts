import { Position } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { findNodeUnderCursor } from '@/canvas/utils/nodes/findNodeUnderCursor';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

export function getSelectionEventHandler(
    selectionStart: Position | null,
    setSelectionStart: (value: Position | null) => void,
    setSelectionEnd: (value: Position | null) => void,
    selectItemsInArea?: (start: Position, end: Position) => void,
) {
    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const mousePos = useCanvasStore.getState().mousePosition;

        const { items } = useCanvasStore.getState();
        const nodes = getNodes(items);
        const clickedNode = findNodeUnderCursor(nodes, mousePos);

        if (!clickedNode) {
            setSelectionStart(mousePos);
            setSelectionEnd(mousePos);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!selectionStart || (e.buttons & 1) !== 1) return;

        const mousePos = useCanvasStore.getState().mousePosition;
        setSelectionEnd(mousePos);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (!selectionStart || e.button !== 0) return;

        const mousePos = useCanvasStore.getState().mousePosition;
        selectItemsInArea?.(selectionStart, mousePos);
        setSelectionStart(null);
        setSelectionEnd(null);
    };

    return { handleMouseDown, handleMouseMove, handleMouseUp };
}
