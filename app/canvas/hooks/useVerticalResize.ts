import { useState, useEffect, useCallback } from 'react';

export default function useVerticalResize(initialHeight: number, minHeight = 100, topOffset = 0) {
    const [height, setHeight] = useState(initialHeight);
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            const availableHeight = window.innerHeight - e.clientY - topOffset;
            if (availableHeight >= minHeight) {
                setHeight(availableHeight);
            }
        },
        [minHeight, topOffset],
    );

    useEffect(() => {
        if (!isResizing) return;

        const stopResize = () => setIsResizing(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', stopResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopResize);
        };
    }, [isResizing, handleMouseMove]);

    return { height, isResizing, startResize: () => setIsResizing(true) };
}
