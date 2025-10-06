'use client';

import Link from 'next/link';
import GithubBager from '@/components/GithubBager';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Header() {
    return (
        <header className="sticky top-0 w-full border-b border-border px-4 bg-background z-50">
            <div className="container flex justify-between items-center m-auto h-16">
                <div className="flex gap-6 items-center text-[15px]">
                    <Link href="/" className="tracking-widest font-extrabold text-base select-none">
                        KNTTR
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <GithubBager />
                </div>
            </div>
        </header>
    );
}
