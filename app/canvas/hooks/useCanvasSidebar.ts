'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useCanvasStore } from '@/canvas/store/сanvasStore';
import useVerticalResize from '@/canvas/hooks/useVerticalResize';

export function useCanvasSidebar() {
    const { items, inspectorItem, setInspectorItem } = useCanvasStore();

    const [filterText, setFilterText] = useState('');
    const topBlockRef = useRef<HTMLDivElement | null>(null);
    const [topOffset, setTopOffset] = useState(0);

    useLayoutEffect(() => {
        const updateTopOffset = () => {
            if (topBlockRef.current) {
                setTopOffset(topBlockRef.current.getBoundingClientRect().bottom);
            }
        };
        updateTopOffset();
        window.addEventListener('resize', updateTopOffset);
        return () => window.removeEventListener('resize', updateTopOffset);
    }, []);

    const { height: inspectorHeight, isResizing, startResize } = useVerticalResize(600, 120, topOffset);

    useEffect(() => {
        if (inspectorItem && !items.some((i) => i.id === inspectorItem.id)) {
            setInspectorItem(null);
        }
    }, [items, inspectorItem, setInspectorItem]);

    return {
        filterText,
        setFilterText,
        topBlockRef,
        inspectorHeight,
        isResizing,
        startResize,
        items,
        inspectorItem,
    };
}
