import { useEffect, RefObject } from 'react';
import { Point, Node } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';
import { drawNodes } from '@/canvas/utils/drawNodes';
import { drawSelectionBox } from '@/canvas/utils/drawSelectionBox';

export function useCanvasRenderer(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    offset: Point,
    zoomLevel: number,
    selectionStart: Point | null,
    selectionEnd: Point | null,
    nodes: Node[],
    selectedNodeIds: number[],
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

        drawNodes(ctx, nodes, selectedNodeIds, NODE_SIZE);

        if (selectionStart && selectionEnd) {
            drawSelectionBox(ctx, selectionStart, selectionEnd);
        }
    }, [offset, canvasRef, selectionStart, selectionEnd, nodes, selectedNodeIds, zoomLevel]);
}
