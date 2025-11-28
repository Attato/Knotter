export function getNodeColor(nodeId: string): string {
    let hash = 0;

    for (let i = 0; i < nodeId.length; i++) {
        hash = nodeId.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = ((hash & 0xff) % 100) + 50; // 50-150
    const g = (((hash >> 8) & 0xff) % 100) + 50; // 50-150
    const b = (((hash >> 16) & 0xff) % 100) + 50; // 50-150

    return `rgb(${r}, ${g}, ${b})`;
}
