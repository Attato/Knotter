import { useEffect, RefObject } from 'react';
import { Point, Node } from '@/canvas/canvas.types';

export function useCanvasRenderer(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    offset: Point,
    scale: number,
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

        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);

        for (const node of nodes) {
            const isSelected = selectedNodeIds.includes(node.id);

            switch (node.type) {
                case 'square':
                    ctx.strokeStyle = isSelected ? 'yellow' : 'white';
                    ctx.lineWidth = 1 / scale;

                    const { x, y } = node.position;
                    const size = 10;

                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 1 / scale;
                    ctx.strokeRect(x, y, size, size);

                    if (isSelected) {
                        const padding = 4;
                        ctx.strokeStyle = '#ffc107';
                        ctx.lineWidth = 2 / scale;
                        ctx.strokeRect(x - padding, y - padding, size + 2 * padding, size + 2 * padding);
                    }

                    break;
            }
        }

        if (selectionStart && selectionEnd) {
            const x = Math.min(selectionStart.x, selectionEnd.x);
            const y = Math.min(selectionStart.y, selectionEnd.y);
            const width = Math.abs(selectionEnd.x - selectionStart.x);
            const height = Math.abs(selectionEnd.y - selectionStart.y);

            ctx.fillStyle = 'rgba(0, 120, 215, 0.3)';
            ctx.fillRect(x, y, width, height);

            ctx.strokeStyle = 'rgba(0, 120, 215, 1)';
            ctx.lineWidth = 1 / scale;
            ctx.strokeRect(x, y, width, height);
        }

        ctx.restore();
    }, [scale, offset, canvasRef, selectionStart, selectionEnd, nodes, selectedNodeIds]);
}
