import { useCanvasStore } from '@/canvas/store/canvasStore';
import { Position, Node } from '@/canvas/canvas.types';
import { NODE_SIZE } from '@/canvas/canvas.constants';

export function getNodeDimensions(node?: Node) {
    const editorMode = useCanvasStore.getState().editorMode;

    if (editorMode === 'view') {
        return {
            width: NODE_SIZE,
            height: NODE_SIZE,
        };
    }

    return {
        width: node?.width ?? NODE_SIZE,
        height: node?.height ?? NODE_SIZE,
    };
}

export function findNodeUnderCursor(
    nodes: Node[],
    cursor: Position,
    zoomLevel = 1,
    offset: Position = { x: 0, y: 0 },
): Node | undefined {
    for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];

        const { x, y } = node.position;

        const { width, height } = getNodeDimensions(node);

        const halfWidth = (width * zoomLevel) / 2;
        const halfHeight = (height * zoomLevel) / 2;

        const screenX = x * zoomLevel + offset.x;
        const screenY = y * zoomLevel + offset.y;

        const isCursorOverNode =
            cursor.x >= screenX - halfWidth &&
            cursor.x <= screenX + halfWidth &&
            cursor.y >= screenY - halfHeight &&
            cursor.y <= screenY + halfHeight;

        if (isCursorOverNode) {
            return node;
        }
    }

    return undefined;
}
