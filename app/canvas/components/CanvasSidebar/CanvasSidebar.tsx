'use client';

import { memo } from 'react';

import { Sidebar } from '@/components/UI/Sidebar';
import { Tabs, Tab } from '@/components/UI/Tabs';

import { CanvasSidebarList } from '@/canvas/components/CanvasSidebar/CanvasSidebarList';
import { Inspector } from '@/canvas/components/Inspector/Inspector';
import { Parameters } from '@/canvas/components/Parameters/Parameters';
import { ListTree, Info, Variable } from 'lucide-react';

const tabs: Tab[] = [
    {
        id: 'hierarchy',
        label: 'Иерархия',
        content: <CanvasSidebarList />,
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
        <Sidebar>
            <div className="flex flex-col h-full relative">
                <Tabs tabs={tabs} defaultTab="hierarchy" className="flex-1" />
            </div>
        </Sidebar>
    );
});
