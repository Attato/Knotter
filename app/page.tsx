import Link from 'next/link';
import { GitCommitHorizontal } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 h-screen">
            <div className="flex flex-col items-center justify-center gap-2">
                <GitCommitHorizontal size={48} color="#1f6feb" />

                <h1 className="text-6xl font-extrabold uppercase">Knotter</h1>
            </div>

            <div className="max-w-2xl text-center text-lg">
                Open-source визуальный редактор для проектирования сложных систем в наглядном виде. Построен на{' '}
                <strong>React</strong>, <strong>TypeScript</strong> и <strong>Tailwind CSS</strong>.
            </div>

            <Link
                href="/canvas"
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-neutral-200 text-black rounded-md transition-all"
            >
                Начать - Бесплатно
            </Link>
        </div>
    );
}
