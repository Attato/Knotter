import { useEffect, RefObject } from 'react';

import { NODE_MOVE_MAX_STEP } from '@/canvas/constants';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { useCanvasHistory } from '@/canvas/hooks/useCanvasHistory';
import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';

export function useCanvasHotkeys(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const { items, setItems, setTempEdge, selectedItemIds, setSelectedItemIds } = useCanvasStore();
    const { undo, redo } = useCanvasHistory();

    const handlers = useCanvasHandlers();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const keysPressed = new Set<string>();

        const onKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const target = e.target as HTMLElement;

            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

            const isCtrl = e.ctrlKey || e.metaKey;

            if (keysPressed.has(key)) return;

            keysPressed.add(key);

            const toggleMap: Record<string, () => void> = {
                m: handlers.toggleMagnet,
                ь: handlers.toggleMagnet,
                g: handlers.toggleGrid,
                п: handlers.toggleGrid,
                a: handlers.toggleAxes,
                ф: handlers.toggleAxes,
            };

            if (!isCtrl && !e.shiftKey && toggleMap[key]) return toggleMap[key]();

            if (key === 'delete') return handlers.delete();

            if (isCtrl) {
                const ctrlMap: Record<string, () => void> = {
                    a: handlers.selectAll,
                    ф: handlers.selectAll,
                    у: handlers.selectAllEdges,
                    e: handlers.selectAllEdges,
                    c: handlers.copy,
                    с: handlers.copy,
                    v: handlers.paste,
                    м: handlers.paste,
                    z: e.shiftKey ? redo : undo,
                    я: e.shiftKey ? redo : undo,
                };

                if (ctrlMap[key]) {
                    e.preventDefault();
                    return ctrlMap[key]();
                }
            }

            if (e.shiftKey) {
                if (key === 'a' || key === 'ф') return handlers.addNode();
                if (key === 'e' || key === 'у') return handlers.startEdge();
            }

            const step = NODE_MOVE_MAX_STEP;

            switch (key) {
                case 'arrowup':
                    handlers.moveSelection(0, -step);
                    break;
                case 'arrowdown':
                    handlers.moveSelection(0, step);
                    break;
                case 'arrowleft':
                    handlers.moveSelection(-step, 0);
                    break;
                case 'arrowright':
                    handlers.moveSelection(step, 0);
                    break;
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            keysPressed.delete(e.key.toLowerCase());
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [selectedItemIds, setSelectedItemIds, canvasRef, redo, undo, items, setItems, setTempEdge, handlers]);
}
