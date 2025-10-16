'use client';

import { useState, useCallback } from 'react';
import { Position } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getItemsInSelectionArea } from '@/canvas/utils/getItemsInSelectionArea';

export function useCanvasSelection() {
    const { setSelectedItemIds } = useCanvasStore();

    const [selectionStart, setSelectionStart] = useState<Position | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<Position | null>(null);

    const handleSelectionArea = useCallback(
        (start: Position, end: Position) => {
            const items = useCanvasStore.getState().items;
            const nodes = getNodes(items);
            const selected = getItemsInSelectionArea(nodes, start, end);
            setSelectedItemIds(selected);
        },
        [setSelectedItemIds],
    );

    return { selectionStart, selectionEnd, setSelectionStart, setSelectionEnd, handleSelectionArea };
}
