import { useState, useRef } from 'react';

import Link from 'next/link';

import ThemeToggle from '@/components/ThemeToggle';

import { useCanvasFileActions } from '@/canvas/hooks/useCanvasFileActions';
import { useClickOutside } from '@/canvas/hooks/useClickOutside';

import { Menu, Home, FolderOpen, Download } from 'lucide-react';

export function CanvasControlsMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { handleOpen, handleSaveAs } = useCanvasFileActions();

    useClickOutside(menuRef, () => setOpen(false));

    return (
        <div className="flex flex-col gap-2 w-full" ref={menuRef}>
            <button
                onClick={() => setOpen((p) => !p)}
                className={`p-2 rounded-md w-fit cursor-pointer ${open ? 'bg-bg-accent text-white' : 'bg-card hover:bg-ui'}`}
            >
                <Menu size={16} />
            </button>

            {open && (
                <div className="flex flex-col bg-background-alt rounded-md shadow max-w-60 w-full text-nowrap">
                    <div className="flex flex-col gap-1 m-1">
                        <button
                            onClick={handleOpen}
                            className="px-3 py-2 w-full flex justify-between bg-card hover:bg-ui rounded-md cursor-pointer"
                        >
                            Открыть
                            <FolderOpen size={16} />
                        </button>
                        <button
                            onClick={handleSaveAs}
                            className="px-3 py-2 w-full flex justify-between bg-card hover:bg-ui rounded-md cursor-pointer"
                        >
                            Сохранить как
                            <Download size={16} />
                        </button>

                        <ThemeToggle label="Ночной режим" className="px-3 py-2 w-full flex justify-between" />
                    </div>

                    <hr className="border-b-0 border-border" />

                    <Link
                        href="/"
                        className="flex items-center justify-between gap-2 bg-card hover:bg-ui px-3 py-2 m-1 rounded-md text-axis-y"
                        onClick={() => setOpen(false)}
                    >
                        На главную
                        <Home size={16} />
                    </Link>
                </div>
            )}
        </div>
    );
}
