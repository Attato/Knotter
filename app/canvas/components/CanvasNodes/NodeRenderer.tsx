import { useEffect, useRef } from 'react';
import { EditorMode, Node } from '@/canvas/canvas.types';
import { getShape } from '@/canvas/utils/nodes/getShape';
import { useCanvasStore } from '@/canvas/store/canvasStore';

interface NodeRendererProps {
    node: Node;
    isSelected: boolean;
    editorMode: EditorMode;
}

interface NodeProps {
    node: Node;
    isSelected: boolean;
}

export function NodeRenderer({ node, isSelected, editorMode }: NodeRendererProps) {
    return editorMode === 'edit' ? (
        <EditMode node={node} isSelected={isSelected} />
    ) : (
        <ViewMode node={node} isSelected={isSelected} />
    );
}

function EditMode({ node, isSelected }: NodeProps) {
    const nodeRef = useRef<HTMLDivElement>(null);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);

    useEffect(() => {
        if (nodeRef.current) {
            const rect = nodeRef.current.getBoundingClientRect();

            const logicalWidth = rect.width / zoomLevel;
            const logicalHeight = rect.height / zoomLevel;

            node.width = logicalWidth;
            node.height = logicalHeight;
        }
    }, [node, zoomLevel]);

    return (
        <div
            ref={nodeRef}
            className={`
                relative flex max-w-64 min-w-16 w-fit flex-col border-2 rounded-lg bg-background
                ${isSelected ? 'border-bg-accent' : 'border-foreground'} 
            `}
        >
            <div
                className={`
                    bg-background px-2 py-1 rounded-t-lg border-b-2 truncate flex items-center
                    ${isSelected ? 'border-bg-accent' : 'border-foreground'} 
                `}
            >
                <span className="truncate w-full text-sm">{node.name}</span>
            </div>

            <div className="px-2 py-1 text-foreground overflow-hidden text-sm leading-tight break-words">
                {node.description}
            </div>
        </div>
    );
}

function ViewMode({ node, isSelected }: NodeProps) {
    const shape = getShape(node.shapeType);
    const Icon = shape.icon;
    const isPoint = node.shapeType === 'point';

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <Icon
                className={`w-full h-full ${isPoint ? 'stroke-[3px]' : 'stroke-[1.5px]'} fill-background ${
                    isSelected ? 'text-bg-accent' : 'text-foreground'
                }`}
            />
        </div>
    );
}
