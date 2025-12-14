'use client';

import { memo, type ReactNode } from 'react';

import { Sidebar } from '@/components/UI/Sidebar';

import { SidebarTabs } from '@/canvas/components/CanvasSidebar/SidebarTabs';
import { SidebarPanels } from '@/canvas/components/CanvasSidebar/SidebarPanels';

import { Hierarchy } from '@/canvas/components/Hierarchy/Hierarchy';
import { Inspector } from '@/canvas/components/Inspector/Inspector';
import { Parameters } from '@/canvas/components/Parameters/_core/Parameters';

import { ListTree, Info, Variable, type LucideIcon } from 'lucide-react';

export interface Tab {
    id: string;
    label: string;
    content?: ReactNode;
    icon?: LucideIcon;
}

const tabs: Tab[] = [
    {
        id: 'hierarchy',
        label: 'Иерархия',
        content: <Hierarchy />,
        icon: ListTree,
    },
    {
        id: 'inspector',
        label: 'Инспектор',
        content: <Inspector />,
        icon: Info,
    },
    {
        id: 'parameters',
        label: 'Параметры',
        content: <Parameters />,
        icon: Variable,
    },
];

export const CanvasSidebar = memo(function CanvasSidebar() {
    return (
        <div className="flex h-full">
            <Sidebar tabs={tabs}>
                <SidebarPanels tabs={tabs} />
            </Sidebar>

            <SidebarTabs tabs={tabs.map(({ id, label, icon }) => ({ id, label, icon }))} />
        </div>
    );
});
