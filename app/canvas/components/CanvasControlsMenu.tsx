import { useState, useRef } from 'react';

import Link from 'next/link';

import ThemeToggle from '@/components/ThemeToggle';

import { useCanvasFileActions } from '@/canvas/hooks/useCanvasFileActions';
import { useClickOutside } from '@/canvas/hooks/useClickOutside';

import { Menu, Home, FolderOpen, Download, CircleHelp } from 'lucide-react';

export function CanvasControlsMenu() {
    const [open, setOpen] = useState(false);
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const { handleOpen, handleSaveAs } = useCanvasFileActions();

    useClickOutside(menuRef, () => setOpen(false));
    useClickOutside(popupRef, () => setShowSavePopup(false));

    const onOpenProject = () => {
        setPendingAction(() => () => {
            handleOpen();
        });
        setShowSavePopup(true);
    };

    const handleSaveAndProceed = async () => {
        await handleSaveAs();
        setShowSavePopup(false);
        await pendingAction?.();
        setPendingAction(null);
    };

    const handleDiscardAndProceed = () => {
        setShowSavePopup(false);
        pendingAction?.();
        setPendingAction(null);
    };

    const handleCancel = () => {
        setShowSavePopup(false);
        setPendingAction(null);
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
                            onClick={onOpenProject}
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

            {showSavePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        ref={popupRef}
                        className="flex items-start gap-4 bg-background-alt p-4 rounded-md shadow-md max-w-md w-full"
                    >
                        <CircleHelp size={32} className="text-text-accent" />

                        <div className="flex flex-col gap-1 w-full">
                            <h3>Сохранить файл перед закрытием?</h3>

                            <p className="text-gray">canvas.knotter.json</p>

                            <div className="flex items-center justify-between gap-2 mt-3">
                                <button
                                    onClick={handleSaveAndProceed}
                                    className="px-3 py-2 bg-bg-accent text-white rounded-md cursor-pointer hover:bg-bg-accent/90 w-full"
                                >
                                    Сохранить
                                </button>
                                <button
                                    onClick={handleDiscardAndProceed}
                                    className="px-3 py-2 bg-card hover:bg-ui rounded-md cursor-pointer w-full"
                                >
                                    Не сохранять
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-3 py-2 bg-card hover:bg-ui rounded-md cursor-pointer w-full"
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
