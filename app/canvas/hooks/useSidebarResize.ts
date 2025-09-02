import { useState, useRef } from 'react';

export default function useSidebarResize(baseWidth: number, compactThreshold: number) {
    const [width, setWidth] = useState(baseWidth);
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef(false);

    const isCompact = width <= compactThreshold;

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();

        resizeRef.current = true;
        setIsResizing(true);
        document.documentElement.classList.add('resizing');

        const handleMouseMove = (e: MouseEvent) => {
            if (!resizeRef.current) return;
            let newWidth = window.innerWidth - e.clientX;
            if (newWidth <= compactThreshold + 120) newWidth = compactThreshold;
            setWidth(newWidth);
        };

        const handleMouseUp = () => {
            resizeRef.current = false;
            setIsResizing(false);
            document.documentElement.classList.remove('resizing');

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return { width, isCompact, isResizing, startResize };
}
