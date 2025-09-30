import { useState, useRef } from 'react';

import Link from 'next/link';

import ThemeToggle from '@/components/ThemeToggle';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { useClickOutside } from '@/canvas/hooks/useClickOutside';

import { Menu, Home, FolderOpen, Download } from 'lucide-react';

export function CanvasControlsMenu() {
    const { setItems } = useCanvasStore();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => setOpen(false));

    const handleOpen = async () => {
        try {
            let file: File | undefined;

            if ('showOpenFilePicker' in window) {
                const [fileHandle]: FileSystemFileHandle[] = await (
                    window as unknown as {
                        showOpenFilePicker: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
                    }
                ).showOpenFilePicker({
                    types: [{ description: 'Knotter JSON', accept: { 'application/json': ['.knotter.json'] } }],
                    multiple: false,
                });

                file = await fileHandle.getFile();
            } else {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.knotter.json';
                input.style.display = 'none';
                document.body.appendChild(input);
                input.click();

                file = await new Promise<File | undefined>((resolve) => {
                    input.onchange = () => resolve(input.files?.[0]);
                });

                document.body.removeChild(input);
            }

            if (!file) return;

            const text = await file.text();
            const parsed = JSON.parse(text);

            localStorage.setItem('canvas-storage', JSON.stringify(parsed));

            setItems(parsed.state?.items ?? parsed.items ?? []);

            console.log('Файл успешно загружен');
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                console.log('Открытие файла отменено пользователем');
            } else {
                console.error('Ошибка при открытии файла:', err);
            }
        }
    };

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
