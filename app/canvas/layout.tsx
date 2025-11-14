import { ReactNode } from 'react';

export const metadata = {
    title: 'Knotter',
    description: 'Knotter — это публичный нодовый редактор с открытым исходным кодом, защищенный лицензией GNU GPL',
};

export default function CanvasLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex overflow-hidden" translate="no">
            {children}
        </div>
    );
}
