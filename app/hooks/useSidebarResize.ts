import { useState, useRef } from 'react';

export default function useSidebarResize(minWidth: number, baseWidth: number, maxWidth: number) {
    const [width, setWidth] = useState(baseWidth);
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef(false);

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();

        resizeRef.current = true;
        setIsResizing(true);
        document.documentElement.classList.add('resizing');

        const handleMouseMove = (e: MouseEvent) => {
            if (!resizeRef.current) return;

            let newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;

            if (newWidth < minWidth) newWidth = minWidth;
            if (newWidth > maxWidth) newWidth = maxWidth;

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

    return { width, isResizing, startResize };
}
