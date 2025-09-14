'use client';

import { useEffect, RefObject } from 'react';
import { useTheme } from 'next-themes';
import { Position, CanvasItem, Node, Edge } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';

import { drawNodes } from '@/canvas/utils/drawNodes';
import { drawEdges } from '@/canvas/utils/drawEdges';
import { drawSelectionBox } from '@/canvas/utils/drawSelectionBox';
import { drawTempEdge } from '@/canvas/utils/drawTempEdge';
import { drawGrid } from '@/canvas/utils/drawGrid';
import { getNodes } from '@/canvas/utils/getNodes';
import { getEdges } from '@/canvas/utils/getEdges';

export function useCanvasRenderer(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    offset: Position,
    zoom: number,
    selectionStart: Position | null,
    selectionEnd: Position | null,
    items: CanvasItem[],
    selectedItemIds: string[],
    tempEdge: { from: string; toPos: Position } | null,
    showGrid: boolean,
    showAxes: boolean,
) {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number | null = null;

        const renderCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            const pixelWidth = Math.round(width * dpr);
            const pixelHeight = Math.round(height * dpr);

            if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
                canvas.width = pixelWidth;
                canvas.height = pixelHeight;
            }

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.setTransform(zoom * dpr, 0, 0, zoom * dpr, offset.x * dpr, offset.y * dpr);

            drawGrid(ctx, width, height, zoom, offset, 50, showGrid, showAxes);

            const nodes: Node[] = getNodes(items);
            const edges: Edge[] = getEdges(items);

            drawEdges(ctx, nodes, selectedItemIds, edges);
            drawNodes(ctx, nodes, selectedItemIds, NODE_SIZE);

            if (selectionStart && selectionEnd) {
                drawSelectionBox(ctx, selectionStart, selectionEnd);
            }

            drawTempEdge(ctx, nodes, tempEdge);
        };

        const scheduleRender = () => {
            if (animationFrameId != null) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(renderCanvas);
        };

        scheduleRender();

        const resizeObserver = new ResizeObserver(scheduleRender);
        resizeObserver.observe(canvas);

        const themeObserver = new MutationObserver(() => scheduleRender());

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => {
            if (animationFrameId != null) cancelAnimationFrame(animationFrameId);

            resizeObserver.disconnect();
            themeObserver.disconnect();
        };
    }, [
        canvasRef,
        offset,
        zoom,
        items,
        selectedItemIds,
        selectionStart,
        selectionEnd,
        tempEdge,
        showGrid,
        showAxes,
        resolvedTheme,
    ]);
}
