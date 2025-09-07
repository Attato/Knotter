import { Position, Edge, Node } from '@/canvas/canvas.types';

export function getEdgeAtPosition(edges: Edge[], nodes: Node[], mousePos: Position, tolerance = 6): Edge | null {
    for (const edge of edges) {
        const fromNode = nodes.find((n) => n.id === edge.from);
        const toNode = nodes.find((n) => n.id === edge.to);
        if (!fromNode || !toNode) continue;

        const x1 = fromNode.position.x;
        const y1 = fromNode.position.y;
        const x2 = toNode.position.x;
        const y2 = toNode.position.y;

        const A = mousePos.x - x1;
        const B = mousePos.y - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        const param = len_sq !== 0 ? dot / len_sq : -1;

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = mousePos.x - xx;
        const dy = mousePos.y - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= tolerance) {
            return edge;
        }
    }

    return null;
}
