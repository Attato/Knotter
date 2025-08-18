import { useEffect, useCallback, useRef } from 'react';
import { Node } from '@/canvas/canvas.types';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export function useCanvasHotkeys() {
    const { nodes, setNodes, selectedNodeIds, setSelectedNodeIds } = useCanvasStore();

    const clipboardRef = useRef<Node[]>([]);
    const historyRef = useRef<Node[][]>([]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            if (key === 'delete' || key === 'backspace') {
                historyRef.current.push(nodes);
                setNodes(nodes.filter((node) => !selectedNodeIds.includes(node.id)));
                setSelectedNodeIds([]);
                return;
            }

            if ((key === 'a' || key === 'ф') && e.ctrlKey) {
                e.preventDefault();
                setSelectedNodeIds(nodes.map((n) => n.id));
                return;
            }

            if ((key === 'c' || key === 'с') && e.ctrlKey) {
                e.preventDefault();
                clipboardRef.current = nodes.filter((n) => selectedNodeIds.includes(n.id));
                return;
            }

            if ((key === 'v' || key === 'м') && e.ctrlKey) {
                e.preventDefault();
                if (clipboardRef.current.length === 0) return;

                historyRef.current.push(nodes);

                const maxId = nodes.length > 0 ? Math.max(...nodes.map((n) => n.id)) : 0;
                const offset = 50;

                const newNodes: Node[] = clipboardRef.current.map((node, index) => ({
                    ...node,
                    id: maxId + index + 1,
                    position: {
                        x: node.position.x + offset,
                        y: node.position.y + offset,
                    },
                }));

                setNodes([...nodes, ...newNodes]);
                setSelectedNodeIds(newNodes.map((n) => n.id));
                return;
            }

            if ((key === 'z' || key === 'я') && e.ctrlKey) {
                e.preventDefault();
                const lastState = historyRef.current.pop();

                if (lastState) {
                    setNodes(lastState);
                    setSelectedNodeIds([]);
                }
                return;
            }
        },
        [nodes, selectedNodeIds, setNodes, setSelectedNodeIds],
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
