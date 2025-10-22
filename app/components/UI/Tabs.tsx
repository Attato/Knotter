'use client';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { LucideIcon } from 'lucide-react';

export interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: LucideIcon;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    className?: string;
}

export function Tabs({ tabs, defaultTab, className = '' }: TabsProps) {
    const activeTab = useCanvasStore((state) => state.activeTab);
    const setActiveTab = useCanvasStore((state) => state.setActiveTab);

    const currentActiveTab = activeTab || defaultTab || tabs[0]?.id;

    const activeTabContent = tabs.find((tab) => tab.id === currentActiveTab)?.content;

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <div className={`flex flex-col h-full ${className}`}>
            <div className="flex p-1 gap-1 border-b border-border">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentActiveTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md outline-none tabular-nums cursor-pointer ${isActive ? 'bg-bg-accent/15 text-text-accent' : 'bg-card hover:bg-ui focus-visible:bg-ui'}`}
                        >
                            {Icon && <Icon size={14} />}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 overflow-auto">{activeTabContent}</div>
        </div>
    );
}
