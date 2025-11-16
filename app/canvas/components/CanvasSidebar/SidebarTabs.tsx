'use client';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { LucideIcon } from 'lucide-react';

interface SidebarTabsProps {
    tabs: {
        id: string;
        label: string;
        icon?: LucideIcon;
    }[];
}

export function SidebarTabs({ tabs }: SidebarTabsProps) {
    const activeTab = useCanvasStore((s) => s.activeTab);
    const setActiveTab = useCanvasStore((s) => s.setActiveTab);

    return (
        <div className="flex flex-col w-12 border-border bg-background-alt">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(isActive ? null : tab.id)}
                        className={`flex items-center justify-center p-3 text-gray hover:text-foreground cursor-pointer focus-visible:outline-0 ${
                            isActive
                                ? 'text-text-accent hover:text-text-accent focus-visible:text-text-accent'
                                : 'focus-visible:text-white'
                        }`}
                    >
                        {Icon && <Icon size={20} />}
                    </button>
                );
            })}
        </div>
    );
}
