import { useLayoutEffect, useState, RefObject } from 'react';
import { Point } from '@/canvas/canvas.types';

export function useInitialCanvasOffset(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
    const [isInitialOffsetSet, setInitialOffsetFlag] = useState(false);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || isInitialOffsetSet) return;

        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            setOffset({ x: rect.width / 2, y: rect.height / 2 });
            setInitialOffsetFlag(true);
        }
    }, [canvasRef, isInitialOffsetSet]);

    return { offset, setOffset, isInitialOffsetSet, setInitialOffsetFlag };
}
