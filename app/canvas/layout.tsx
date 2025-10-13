'use client';

import { ReactNode } from 'react';
import { CanvasSidebar } from '@/canvas/components/CanvasSidebar/CanvasSidebar';
import { ToastProvider } from '@/components/UI/Toast';

export default function CanvasLayout({ children }: { children: ReactNode }) {
    return (
        <ToastProvider>
            <div className="flex overflow-hidden">
                <main className="h-full w-full">{children}</main>
                <CanvasSidebar />
            </div>
        </ToastProvider>
    );
}
