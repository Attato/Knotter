import { useState, useRef } from 'react';

import Link from 'next/link';

import ThemeToggle from '@/components/ThemeToggle';

import { useClickOutside } from '@/canvas/hooks/useClickOutside';

import { Menu, Home, Download } from 'lucide-react';

export function CanvasControlsMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => setOpen(false));

    const handleSaveAs = async () => {
        try {
            const rawData = localStorage.getItem('canvas-storage');
            if (!rawData) return;

            const items = JSON.parse(rawData).state?.items ?? JSON.parse(rawData).items;
            if (!items) return;

            const blob = new Blob([JSON.stringify({ items }, null, 2)], { type: 'application/json' });

            if ('showSaveFilePicker' in window) {
                const fileHandle: FileSystemFileHandle = await window.showSaveFilePicker({
                    suggestedName: 'Файл1.knotter.json',
                    types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
                });

                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');

                a.href = url;
                a.download = 'Файл1.knotter.json';
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                console.log('Сохранение отменено пользователем');
            } else {
                console.error('Ошибка сохранения:', err);
            }
        }
    };

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
                            onClick={handleSaveAs}
                            className="px-3 py-2 w-full flex justify-between bg-card hover:bg-ui rounded-md cursor-pointer"
                        >
                            Скачать
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
