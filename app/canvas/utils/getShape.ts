import { NodeShapeType } from '@/canvas/canvas.types';
import { Circle, Squircle, Triangle, Hexagon, Octagon, Diamond, Dot, type LucideIcon } from 'lucide-react';

const SHAPES: Record<NodeShapeType, { label: string; icon: LucideIcon }> = {
    point: { label: 'Точка', icon: Dot },
    circle: { label: 'Круг', icon: Circle },
    squircle: { label: 'Сквиркл', icon: Squircle },
    triangle: { label: 'Треугольник', icon: Triangle },
    diamond: { label: 'Ромб', icon: Diamond },
    hexagon: { label: 'Шестиугольник', icon: Hexagon },
    octagon: { label: 'Восьмиугольник', icon: Octagon },
};

export function getShape(type: NodeShapeType) {
    return SHAPES[type];
}

export function getAllShapes(): NodeShapeType[] {
    return Object.keys(SHAPES) as NodeShapeType[];
}
