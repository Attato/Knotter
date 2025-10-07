import { memo } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FolderOpen, Download, Home } from 'lucide-react';
import Link from 'next/link';

interface MenuContentProps {
    onOpenProject: () => void;
    onSaveAs: () => void;
}

const HomeLink = memo(function HomeLink() {
    return (
        <Link
            href="/"
            className="flex items-center justify-between gap-2 bg-card hover:bg-ui px-3 py-2 rounded-md text-axis-y"
        >
            На главную
            <Home size={16} />
        </Link>
    );
});

export const MenuContent = memo(function MenuContent({ onOpenProject, onSaveAs }: MenuContentProps) {
    return (
        <div className="flex flex-col bg-background-alt rounded-md shadow w-full text-nowrap">
            <div className="flex flex-col gap-1 m-1">
                <button
                    onClick={onOpenProject}
                    className="px-3 py-2 w-full flex justify-between bg-card hover:bg-ui rounded-md cursor-pointer"
                >
                    Открыть
                    <FolderOpen size={16} />
                </button>

                <button
                    onClick={onSaveAs}
                    className="px-3 py-2 w-full flex justify-between bg-card hover:bg-ui rounded-md cursor-pointer"
                >
                    Сохранить как
                    <Download size={16} />
                </button>

                <ThemeToggle label="Ночной режим" className="px-3 py-2 w-full flex justify-between" />
            </div>

            <hr className="border-b-0 border-border" />

            <div className="m-1">
                <HomeLink />
            </div>
        </div>
    );
});
