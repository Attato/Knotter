import { useLayoutEffect, RefObject } from 'react';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export function useInitialCanvasOffset(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const { offset, setOffset } = useCanvasStore();

    const isInitialOffsetSet = offset.x !== 0 || offset.y !== 0;

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || isInitialOffsetSet) return;

        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            setOffset({ x: rect.width / 2, y: rect.height / 2 });
        }
    }, [canvasRef, isInitialOffsetSet, setOffset]);
}
