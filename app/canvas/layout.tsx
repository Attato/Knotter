'use client';

import { ReactNode } from 'react';
import CanvasSidebar from '@/canvas/components/CanvasSidebar';

export default function CanvasLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex overflow-hidden">
            <main className="h-full w-full">{children}</main>

            <CanvasSidebar />
        </div>
    );
}
