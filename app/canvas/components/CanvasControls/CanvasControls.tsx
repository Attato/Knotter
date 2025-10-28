'use client';

import { useMemo, memo, useState, useEffect, useCallback } from 'react';

import { CanvasControlsMenu } from '@/canvas/components/CanvasControls/CanvasControlsMenu';
import { CanvasControlButtons } from '@/canvas/components/CanvasControls/CanvasControlButtons';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { toggleMagnetMode } from '@/canvas/utils/canvas/toggleMagnetMode';

import { Magnet, Grid2x2, Move3d, Eye, EyeOff, EyeClosed } from 'lucide-react';

export const CanvasControls = memo(function CanvasControls() {
    const isMagnet = useCanvasStore((s) => s.isMagnet);
    const showGrid = useCanvasStore((s) => s.showGrid);
    const showAxes = useCanvasStore((s) => s.showAxes);
    const tooltipMode = useCanvasStore((s) => s.tooltipMode);
    const setTooltipMode = useCanvasStore((s) => s.setTooltipMode);
    const toggleShowGrid = useCanvasStore((s) => s.toggleShowGrid);
    const toggleShowAxes = useCanvasStore((s) => s.toggleShowAxes);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleTooltipModeToggle = useCallback(() => {
        const modes = ['always', 'hover', 'never'] as const;
        const currentIndex = modes.indexOf(tooltipMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setTooltipMode(modes[nextIndex]);
    }, [tooltipMode, setTooltipMode]);

    const getTooltipIcon = useCallback(() => {
        switch (tooltipMode) {
            case 'always':
                return Eye;
            case 'hover':
                return EyeClosed;
            case 'never':
                return EyeOff;
            default:
                return Eye;
        }
    }, [tooltipMode]);

    const getTooltipLabel = useCallback(() => {
        switch (tooltipMode) {
            case 'always':
                return 'Тултипы: Всегда (T)';
            case 'hover':
                return 'Тултипы: При наведении (T)';
            case 'never':
                return 'Тултипы: Никогда (T)';
            default:
                return 'Тултипы (T)';
        }
    }, [tooltipMode]);

    const controls = useMemo(
        () => [
            {
                active: tooltipMode !== 'never',
                onClick: handleTooltipModeToggle,
                Icon: getTooltipIcon(),
                label: getTooltipLabel(),
            },
            { active: isMagnet, onClick: toggleMagnetMode, Icon: Magnet, label: 'Магнит (M)' },
            { active: showGrid, onClick: toggleShowGrid, Icon: Grid2x2, label: 'Сетка (G)' },
            { active: showAxes, onClick: toggleShowAxes, Icon: Move3d, label: 'Оси (A)' },
        ],
        [
            isMagnet,
            showGrid,
            showAxes,
            tooltipMode,
            handleTooltipModeToggle,
            getTooltipIcon,
            getTooltipLabel,
            toggleShowGrid,
            toggleShowAxes,
        ],
    );

    if (!mounted) return null;

    return (
        <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-start z-10 text-sm">
            <CanvasControlsMenu />
            <CanvasControlButtons controls={controls} />
        </div>
    );
});
