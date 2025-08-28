import { useEffect, RefObject } from 'react';
import { Position, Node } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';
import { drawNodes } from '@/canvas/utils/drawNodes';
import { drawSelectionBox } from '@/canvas/utils/drawSelectionBox';
import { drawEdges } from '@/canvas/utils/drawEdges';
import { Edge } from '@/canvas/canvas.types';

export function useCanvasRenderer(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    offset: Position,
    zoomLevel: number,
    selectionStart: Position | null,
    selectionEnd: Position | null,
    nodes: Node[],
    selectedNodeIds: string[],
    edges: Edge[],
    tempEdge: { from: string; toPos: Position } | null,
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

        drawEdges(ctx, nodes, edges);
        drawNodes(ctx, nodes, selectedNodeIds, NODE_SIZE);

        if (selectionStart && selectionEnd) {
            drawSelectionBox(ctx, selectionStart, selectionEnd);
        }

        if (tempEdge) {
            const fromNode = nodes.find((n) => n.id === tempEdge.from);
            if (fromNode) {
                ctx.strokeStyle = '#ccc';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(fromNode.position.x + NODE_SIZE / 2, fromNode.position.y + NODE_SIZE / 2);
                ctx.lineTo(tempEdge.toPos.x, tempEdge.toPos.y);
                ctx.stroke();
            }
        }
    }, [canvasRef, offset, zoomLevel, nodes, selectedNodeIds, edges, selectionStart, selectionEnd, tempEdge]);
}
