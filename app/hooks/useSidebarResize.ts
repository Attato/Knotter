import { useState, useRef } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export default function useSidebarResize(minWidth: number, maxWidth: number) {
    const sidebarWidth = useCanvasStore((state) => state.sidebarWidth);
    const setSidebarWidth = useCanvasStore((state) => state.setSidebarWidth);

    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef(false);

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();

        resizeRef.current = true;
        setIsResizing(true);
        document.documentElement.classList.add('resizing');

        const handleMouseMove = (e: MouseEvent) => {
            if (!resizeRef.current) return;

            let newWidth = window.innerWidth - e.clientX;

            if (newWidth < minWidth) newWidth = minWidth;
            if (newWidth > maxWidth) newWidth = maxWidth;

            setSidebarWidth(newWidth);
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

    return { width: sidebarWidth, isResizing, startResize };
}
