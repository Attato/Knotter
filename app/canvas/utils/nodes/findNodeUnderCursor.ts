import { Position, Node } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/constants';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export function getNodeDimensions(
    node: Node,
    isEditMode: boolean,
    ctx?: CanvasRenderingContext2D,
): { width: number; height: number } {
    if (!isEditMode) {
        return { width: NODE_SIZE, height: NODE_SIZE };
    }

    if (!ctx) {
        const canvas = document.createElement('canvas');
        const tempCtx = canvas.getContext('2d');
        if (!tempCtx) return { width: NODE_SIZE * 5, height: NODE_SIZE * 3 };

        tempCtx.font = '300 14px Inter, system-ui, sans-serif';

        const textWidth = tempCtx.measureText(node.name).width;
        const padding = 12;
        const minWidth = NODE_SIZE;

        return {
            width: Math.max(minWidth, textWidth + padding * 2),
            height: NODE_SIZE * 3,
        };
    }

    ctx.font = '300 14px Inter, system-ui, sans-serif';
    const textWidth = ctx.measureText(node.name).width;
    const padding = 12;
    const minWidth = NODE_SIZE;

    return {
        width: Math.max(minWidth, textWidth + padding * 2),
        height: NODE_SIZE * 3,
    };
}

export function findNodeUnderCursor(nodes: Node[], cursor: Position, ctx?: CanvasRenderingContext2D): Node | undefined {
    const editorMode = useCanvasStore.getState().editorMode;
    const isEditMode = editorMode === 'edit';

    return nodes.find((node) => {
        const { x, y } = node.position;

        if (isEditMode) {
            const { width, height } = getNodeDimensions(node, isEditMode, ctx);

            return (
                cursor.x >= x - width / 2 &&
                cursor.x <= x + width / 2 &&
                cursor.y >= y - height / 2 &&
                cursor.y <= y + height / 2
            );
        } else {
            const halfSize = NODE_SIZE / 2;

            return (
                cursor.x >= x - halfSize && cursor.x <= x + halfSize && cursor.y >= y - halfSize && cursor.y <= y + halfSize
            );
        }
    });
}
