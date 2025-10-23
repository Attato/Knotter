'use client';

import { memo } from 'react';

import { Sidebar } from '@/components/UI/Sidebar';
import { Tabs, Tab } from '@/components/UI/Tabs';

import { Hierarchy } from '@/canvas/components/Hierarchy/Hierarchy';
import { Inspector } from '@/canvas/components/Inspector/Inspector';
import { Parameters } from '@/canvas/components/Parameters/Parameters';
import { ListTree, Info, Variable } from 'lucide-react';

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
        <Sidebar>
            <div className="flex flex-col h-full relative">
                <Tabs tabs={tabs} defaultTab="hierarchy" className="flex-1" />
            </div>
        </Sidebar>
    );
});
