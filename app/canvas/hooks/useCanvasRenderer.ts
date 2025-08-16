import { useEffect, RefObject } from 'react';
import { Point, Node } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';
import { drawOctagon } from '@/canvas/utils/drawOctagon';

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

        const padding = 4;

        for (const node of nodes) {
            const isSelected = selectedNodeIds.includes(node.id);
            const { x, y } = node.position;

            ctx.save();
            ctx.beginPath();
            drawOctagon(ctx, x, y, NODE_SIZE);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.restore();

            if (isSelected) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(x - padding, y - padding, NODE_SIZE + 2 * padding, NODE_SIZE + 2 * padding);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#ffc107';
                ctx.stroke();
                ctx.restore();
            }
        }

        if (selectionStart && selectionEnd) {
            const x = Math.min(selectionStart.x, selectionEnd.x);
            const y = Math.min(selectionStart.y, selectionEnd.y);
            const width = Math.abs(selectionEnd.x - selectionStart.x);
            const height = Math.abs(selectionEnd.y - selectionStart.y);

            ctx.save();
            ctx.fillStyle = 'rgba(0, 120, 215, 0.3)';
            ctx.fillRect(x, y, width, height);
            ctx.strokeStyle = 'rgba(0, 120, 215, 1)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, width, height);
            ctx.restore();
        }
    }, [offset, canvasRef, selectionStart, selectionEnd, nodes, selectedNodeIds, zoomLevel]);
}
