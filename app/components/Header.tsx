'use client';

import Link from 'next/link';

import GithubBager from '@/components/GithubBager';

export default function Header() {
    return (
        <header className="sticky top-0 w-full border-b border-[#1a1a1a] px-4">
            <div className="container flex justify-between items-center m-auto h-16">
                <div className="flex gap-6 text-[15px] items-center">
                    <Link href="/" className="tracking-widest font-extrabold mr-10 text-base">
                        KNTTR
                    </Link>
                </div>

                <GithubBager />
            </div>
        </header>
    );
}
