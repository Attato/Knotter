'use client';

import { Magnet, Grid2x2, Move3d } from 'lucide-react';
import { Tooltip } from '@/components/UI/Tooltip';
import { toggleMagnetMode } from '@/canvas/utils/toggleMagnetMode';

interface CanvasControlsProps {
    isMagnet: boolean;
    showGrid: boolean;
    showAxes: boolean;
    toggleShowGrid: () => void;
    toggleShowAxes: () => void;
}

export function CanvasControls({ isMagnet, showGrid, showAxes, toggleShowGrid, toggleShowAxes }: CanvasControlsProps) {
    const controls = [
        { active: isMagnet, onClick: toggleMagnetMode, Icon: Magnet, label: 'Магнит (M)' },
        { active: showGrid, onClick: toggleShowGrid, Icon: Grid2x2, label: 'Сетка (G)' },
        { active: showAxes, onClick: toggleShowAxes, Icon: Move3d, label: 'Оси (A)' },
    ];

    return (
        <div className="absolute top-4 right-4 flex gap-2 z-60">
            {controls.map(({ active, onClick, Icon, label }, index) => (
                <Tooltip key={index} label={label}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className={`p-2 rounded-md w-fit cursor-pointer ${
                            active ? 'bg-accent text-white' : 'bg-card hover:bg-ui'
                        }`}
                    >
                        <Icon size={16} />
                    </button>
                </Tooltip>
            ))}
        </div>
    );
}
