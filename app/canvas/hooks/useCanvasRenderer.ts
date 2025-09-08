import { useEffect, RefObject } from 'react';
import { Position, CanvasItem, Node, Edge } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';

import { drawNodes } from '@/canvas/utils/drawNodes';
import { drawSelectionBox } from '@/canvas/utils/drawSelectionBox';
import { drawEdges } from '@/canvas/utils/drawEdges';
import { drawTempEdge } from '@/canvas/utils/drawTempEdge';
import { drawGrid } from '@/canvas/utils/drawGrid';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';

export function useCanvasRenderer(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    offset: Position,
    zoomLevel: number,
    selectionStart: Position | null,
    selectionEnd: Position | null,
    items: CanvasItem[],
    selectedItemIds: string[],
    tempEdge: { from: string; toPos: Position } | null,
    showGrid: boolean,
    showAxes: boolean,
) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(zoomLevel, 0, 0, zoomLevel, offset.x, offset.y);

        drawGrid(ctx, canvas.width, canvas.height, zoomLevel, offset, 50, showGrid, showAxes);

        const nodes: Node[] = getNodes(items);
        const edges: Edge[] = getEdges(items);

        drawEdges(ctx, nodes, selectedItemIds, edges);
        drawNodes(ctx, nodes, selectedItemIds, NODE_SIZE);

        if (selectionStart && selectionEnd) {
            drawSelectionBox(ctx, selectionStart, selectionEnd);
        }

        drawTempEdge(ctx, nodes, tempEdge);
    }, [canvasRef, offset, zoomLevel, items, selectedItemIds, selectionStart, selectionEnd, tempEdge, showAxes, showGrid]);
}
