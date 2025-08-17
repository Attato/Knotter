import { useEffect, useCallback } from 'react';
import { Node } from '@/canvas/canvas.types';

export function useCanvasHotkeys(
    nodes: Node[],
    selectedNodeIds: number[],
    setSelectedNodeIds: React.Dispatch<React.SetStateAction<number[]>>,
    setNodes: (updater: (prev: Node[]) => Node[]) => void,
) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            switch (key) {
                case 'delete':
                case 'backspace': {
                    setNodes((prev) => prev.filter((node) => !selectedNodeIds.includes(node.id)));
                    setSelectedNodeIds([]);
                    break;
                }

                case 'a':
                case 'ф': {
                    if (e.ctrlKey) {
                        e.preventDefault();
                        setSelectedNodeIds(nodes.map((n) => n.id));
                    }
                    break;
                }

                default:
                    break;
            }
        },
        [nodes, selectedNodeIds, setNodes, setSelectedNodeIds],
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
