'use client';

import { ChevronRight } from 'lucide-react';

export type Breadcrumb = { label: string; itemId?: string };

interface BreadcrumbsProps {
    items: Breadcrumb[];
    onClick: (index: number) => void;
}

export default function Breadcrumbs({ items, onClick }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-1 text-sm text-gray px-2 py-2 flex-wrap">
            {items.map((crumb, i) => (
                <div key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight size={14} className="text-gray" />}

                    <button
                        onClick={() => onClick(i)}
                        className={`transition ${i === items.length - 1 ? 'text-foreground' : 'hover:text-foreground cursor-pointer'}`}
                    >
                        {crumb.label}
                    </button>
                </div>
            ))}
        </nav>
    );
}
