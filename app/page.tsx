import Link from 'next/link';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { GitCommitHorizontal } from 'lucide-react';

export default function Home() {
    return (
        <>
            <Header />

            <div className="flex flex-col items-center justify-center gap-6 h-[calc(100vh-64px-56px-1px)] px-4">
                <div className="flex flex-col items-center justify-center gap-2">
                    <GitCommitHorizontal size={48} className="text-text-accent" />

                    <h1 className="text-6xl font-extrabold uppercase">Knotter</h1>
                </div>

                <div className="max-w-2xl text-center text-lg">
                    Open-source визуальный редактор для проектирования сложных систем в наглядном виде. Построен на{' '}
                    <strong>React</strong>, <strong>TypeScript</strong> и <strong>Tailwind CSS</strong>.
                </div>

                <Link
                    href="/canvas"
                    className="flex items-center gap-1 px-3 py-1 bg-card hover:bg-border border border-border text-foreground rounded-md select-none"
                >
                    Начать - Бесплатно
                </Link>
            </div>

            <Footer />
        </>
    );
}
