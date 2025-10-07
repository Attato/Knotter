'use client';

import { useMemo, memo, useState, useEffect } from 'react';

import { CanvasControlsMenu } from '@/canvas/components/CanvasControlsMenu';
import { CanvasControlButtons } from '@/canvas/components/CanvasControlButtons';

import { toggleMagnetMode } from '@/canvas/utils/toggleMagnetMode';

import { Magnet, Grid2x2, Move3d } from 'lucide-react';

interface CanvasControlsProps {
    isMagnet: boolean;
    showGrid: boolean;
    showAxes: boolean;
    toggleShowGrid: () => void;
    toggleShowAxes: () => void;
}

export const CanvasControls = memo(function CanvasControls({
    isMagnet,
    showGrid,
    showAxes,
    toggleShowGrid,
    toggleShowAxes,
}: CanvasControlsProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const controls = useMemo(
        () => [
            { active: isMagnet, onClick: toggleMagnetMode, Icon: Magnet, label: 'Магнит (M)' },
            { active: showGrid, onClick: toggleShowGrid, Icon: Grid2x2, label: 'Сетка (G)' },
            { active: showAxes, onClick: toggleShowAxes, Icon: Move3d, label: 'Оси (A)' },
        ],
        [isMagnet, showGrid, showAxes, toggleShowGrid, toggleShowAxes],
    );

    if (!mounted) return null;

    return (
        <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-start z-10 text-sm">
            <CanvasControlsMenu />
            <CanvasControlButtons controls={controls} />
        </div>
    );
});
