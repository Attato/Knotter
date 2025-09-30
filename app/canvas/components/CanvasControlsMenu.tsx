'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Home } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export function CanvasControlsMenu() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const closeMenu = () => setMenuOpen(false);
        if (menuOpen) window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, [menuOpen]);

    return (
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
    );
}
