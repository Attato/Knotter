'use client';

import { ReactNode } from 'react';

import CanvasSidebar from '@/canvas/components/CanvasSidebar';

export default function CanvasLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen w-screen">
            <main className="flex-1">{children}</main>

            <CanvasSidebar />
        </div>
    );
}
