'use client';

import { ReactNode, useState, useEffect } from 'react';

import Link from 'next/link';

import { CanvasSidebar } from '@/canvas/components/CanvasSidebar/CanvasSidebar';
import { ToastProvider } from '@/components/UI/Toast';

import { LoaderCircle, Frown, X } from 'lucide-react';

const isMobileDevice = (): boolean => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
        'mobile',
        'android',
        'iphone',
        'ipad',
        'ipod',
        'blackberry',
        'windows phone',
        'webos',
        'opera mini',
        'iemobile',
    ];

    if (mobileKeywords.some((keyword) => userAgent.includes(keyword))) {
        return true;
    }

    if (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        return true;
    }

    return false;
};

export default function CanvasLayout({ children }: { children: ReactNode }) {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        setIsMobile(isMobileDevice());

        const handleResize = () => {
            setIsMobile(isMobileDevice());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMobile === null) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2">
                    <LoaderCircle size={24} className="animate-spin" />
                    <p className="text-text-muted">Проверяем размеры экрана...</p>
                </div>
            </div>
        );
    }

    if (isMobile) {
        return (
            <div className="flex flex-col  gap-6 h-screen items-center justify-center" translate="no">
                <div className="flex justify-center items-center flex-col gap-6 max-w-2xl px-4 text-lg text-center">
                    <Frown size={48} className="text-text-accent" />

                    <h1 className="text-6xl font-extrabold uppercase">Упс!</h1>

                    <p className="max-w-2xl text-center text-lg mt-1">
                        Knotter разработан исключительно для ПК. Перейдите на устройство с большим экраном.
                    </p>

                    <Link
                        href="/"
                        className="flex items-center gap-1 px-3 py-1 bg-card hover:bg-ui border border-border text-foreground text-base w-fit rounded-md select-none"
                    >
                        Вернуться на главную
                    </Link>
                </div>

                <div className="fixed flex items-center bottom-4 text-xs text-gray text-center">
                    Размер экрана: {window.innerWidth} <X size={12} className="flex items-center justify-center"></X>
                    {window.innerHeight}px
                </div>
            </div>
        );
    }

    return (
        <ToastProvider>
            <div className="flex overflow-hidden" translate="no">
                <main className="h-full w-full">{children}</main>
                <CanvasSidebar />
            </div>
        </ToastProvider>
    );
}
