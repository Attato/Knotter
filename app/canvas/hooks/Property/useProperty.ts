import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface IDropdown {
    id: number | string;
    title: string;
}

export function useProperty() {
    const [dropdowns, setDropdowns] = useState<IDropdown[]>([
        { id: 1, title: 'Форма' },
        { id: 2, title: 'Трансформация' },
    ]);

    const addDropdown = useCallback(() => {
        setDropdowns((prev) => [
            ...prev,
            {
                id: uuidv4(),
                title: `Выпадающий список (${prev.length + 1})`,
            },
        ]);
    }, []);

    const renameDropdown = useCallback((id: number | string, newTitle: string) => {
        setDropdowns((prev) => prev.map((dd) => (dd.id === id ? { ...dd, title: newTitle } : dd)));
    }, []);

    const staticDropdowns = dropdowns.filter((dd) => typeof dd.id === 'number');
    const dynamicDropdowns = dropdowns.filter((dd) => typeof dd.id === 'string');

    return {
        dropdowns,
        staticDropdowns,
        dynamicDropdowns,
        addDropdown,
        renameDropdown,
    };
}
