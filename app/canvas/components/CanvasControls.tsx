'use client';

import { useState, useEffect } from 'react';

import { Tooltip } from '@/components/UI/Tooltip';
import { CanvasControlsMenu } from '@/canvas/components/CanvasControlsMenu';
import { toggleMagnetMode } from '@/canvas/utils/toggleMagnetMode';

import { Magnet, Grid2x2, Move3d } from 'lucide-react';

interface CanvasControlsProps {
    isMagnet: boolean;
    showGrid: boolean;
    showAxes: boolean;
    toggleShowGrid: () => void;
    toggleShowAxes: () => void;
}

export function CanvasControls({ isMagnet, showGrid, showAxes, toggleShowGrid, toggleShowAxes }: CanvasControlsProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const controls = [
        { active: isMagnet, onClick: toggleMagnetMode, Icon: Magnet, label: 'Магнит (M)' },
        { active: showGrid, onClick: toggleShowGrid, Icon: Grid2x2, label: 'Сетка (G)' },
        { active: showAxes, onClick: toggleShowAxes, Icon: Move3d, label: 'Оси (A)' },
    ];

    useEffect(() => {
        const closeMenu = () => setMenuOpen(false);
        if (menuOpen) window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, [menuOpen]);

    return (
        <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-start z-10 text-sm">
            <CanvasControlsMenu />

            <div className="flex gap-2">
                {controls.map(({ active, onClick, Icon, label }, index) => (
                    <Tooltip key={index} label={label}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick();
                            }}
                            className={`p-2 rounded-md w-fit cursor-pointer ${
                                active ? 'bg-bg-accent text-white' : 'bg-card hover:bg-ui'
                            }`}
                        >
                            <Icon size={16} />
                        </button>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}
