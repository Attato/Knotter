import { useEffect, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(ref: RefObject<T | null>, onClose: () => void) {
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [ref, onClose]);
}
