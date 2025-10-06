'use client';

import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import useVerticalResize from '@/canvas/hooks/useVerticalResize';

export function useCanvasSidebar() {
    const items = useCanvasStore((state) => state.items);

    const [filterText, setFilterText] = useState('');
    const topBlockRef = useRef<HTMLDivElement | null>(null);
    const [topOffset, setTopOffset] = useState(0);

    const updateTopOffset = useCallback(() => {
        if (topBlockRef.current) {
            setTopOffset(topBlockRef.current.getBoundingClientRect().bottom);
        }
    }, []);

    useLayoutEffect(() => {
        updateTopOffset();
        window.addEventListener('resize', updateTopOffset);
        return () => window.removeEventListener('resize', updateTopOffset);
    }, [updateTopOffset]);

    const { height: inspectorHeight, isResizing, startResize } = useVerticalResize(600, 120, topOffset);

    return {
        filterText,
        setFilterText,
        topBlockRef,
        inspectorHeight,
        isResizing,
        startResize,
        items,
    };
}
