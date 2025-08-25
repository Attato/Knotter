import { useEffect, useCallback, useRef } from 'react';
import { Node, Edge, CanvasState } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/сanvasStore';

import { handleAddNode } from '@/canvas/utils/handleAddNode';
import { handleDeleteNode } from '@/canvas/utils/handleDeleteNode';

export function useCanvasHotkeys() {
    const { nodes, setNodes, edges, setEdges, setTempEdge, selectedNodeIds, setSelectedNodeIds } = useCanvasStore();

    const clipboardRef = useRef<CanvasState>({ nodes: [], edges: [] });
    const historyRef = useRef<CanvasState[]>([]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const pushHistory = () => {
                historyRef.current.push({ nodes, edges });
            };

            const key = e.key.toLowerCase();

            if (key === 'delete' || key === 'backspace') {
                pushHistory();
                const { nodes: newNodes, edges: newEdges } = handleDeleteNode(nodes, edges, selectedNodeIds);
                setNodes(newNodes);
                setEdges(newEdges);
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
                clipboardRef.current = {
                    nodes: nodes.filter((n) => selectedNodeIds.includes(n.id)),
                    edges: edges.filter((edge) => selectedNodeIds.includes(edge.from) && selectedNodeIds.includes(edge.to)),
                };
                return;
            }

            if ((key === 'v' || key === 'м') && e.ctrlKey) {
                e.preventDefault();
                if (clipboardRef.current.nodes.length === 0) return;

                pushHistory();

                const maxId = nodes.length > 0 ? Math.max(...nodes.map((n) => n.id)) : 0;
                const offset = 50;

                const newNodes: Node[] = clipboardRef.current.nodes.map((node, index) => ({
                    ...node,
                    id: maxId + index + 1,
                    position: {
                        x: node.position.x + offset,
                        y: node.position.y + offset,
                    },
                }));

                const nodeIdMap = new Map<number, number>();
                clipboardRef.current.nodes.forEach((node, index) => {
                    nodeIdMap.set(node.id, newNodes[index].id);
                });

                const maxEdgeId = edges.length > 0 ? Math.max(...edges.map((e) => e.id)) : 0;

                const newEdges: Edge[] = clipboardRef.current.edges.map((edge, index) => ({
                    id: maxEdgeId + index + 1,
                    from: nodeIdMap.get(edge.from)!,
                    to: nodeIdMap.get(edge.to)!,
                }));

                setNodes([...nodes, ...newNodes]);
                setEdges([...edges, ...newEdges]);
                setSelectedNodeIds(newNodes.map((n) => n.id));
            }

            if ((key === 'z' || key === 'я') && e.ctrlKey) {
                e.preventDefault();
                const lastState = historyRef.current.pop();
                if (lastState) {
                    setNodes(lastState.nodes);
                    setEdges(lastState.edges);
                    setSelectedNodeIds([]);
                }
                return;
            }

            if ((key === 'a' || key === 'ф') && e.shiftKey) {
                e.preventDefault();
                const newNodes = handleAddNode(nodes);
                setNodes(newNodes);
                setSelectedNodeIds([newNodes[newNodes.length - 1].id]);
                return;
            }

            if ((key === 'e' || key === 'у') && e.shiftKey) {
                e.preventDefault();

                if (selectedNodeIds.length === 0) return;

                const fromNodeId = selectedNodeIds[0];
                const fromNode = nodes.find((n) => n.id === fromNodeId);

                if (!fromNode) return;

                setTempEdge({
                    from: fromNodeId,
                    toPos: { ...fromNode.position },
                });

                return;
            }
        },
        [nodes, edges, selectedNodeIds, setNodes, setEdges, setTempEdge, setSelectedNodeIds],
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
