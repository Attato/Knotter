'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Tooltip } from '@/components/UI/Tooltip';
import ThemeToggle from '@/components/ThemeToggle';

import { toggleMagnetMode } from '@/canvas/utils/toggleMagnetMode';

import { Magnet, Grid2x2, Move3d, Menu, Home } from 'lucide-react';

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

    return (
        <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-start z-10 text-sm">
            <div className="flex flex-col gap-2 w-full">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen((prev) => !prev);
                    }}
                    className={`p-2 rounded-md w-fit cursor-pointer ${
                        menuOpen ? 'bg-bg-accent text-white' : 'bg-card hover:bg-ui'
                    }`}
                >
                    <Menu size={16} />
                </button>

                {menuOpen && (
                    <div className="flex flex-col bg-background-alt rounded-md shadow max-w-60 w-full text-nowrap">
                        <div className="m-1">
                            <ThemeToggle label="Ночной режим" className="px-3 py-2 w-full flex justify-between" />
                        </div>

                        <hr className="border-b-0 border-border" />

                        <Link
                            href="/"
                            className="flex items-center justify-between gap-2 bg-card hover:bg-ui px-3 py-2 m-1 rounded-md text-axis-y"
                        >
                            На главную
                            <Home size={16} />
                        </Link>
                    </div>
                )}
            </div>

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
