import { useCanvasStore } from '@/canvas/store/canvasStore';
import { Position } from '@/canvas/canvas.types';

export function getCanvasCenter(canvas: HTMLCanvasElement): Position {
    const { offset, zoomLevel, invertY } = useCanvasStore.getState();
    const rect = canvas.getBoundingClientRect();

    const centerX = (rect.width / 2 - offset.x) / zoomLevel;
    const centerY = invertY ? (rect.height / 2 - offset.y) / zoomLevel : (rect.height / 2 - offset.y) / zoomLevel;

    return { x: centerX, y: centerY };
}
