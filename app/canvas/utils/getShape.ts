import { NodeShapeType } from '@/canvas/canvas.types';
import { Circle, Squircle, Triangle, Hexagon, Octagon, Diamond, Dot, type LucideIcon } from 'lucide-react';

const SHAPE_ICONS: Record<NodeShapeType, LucideIcon> = {
    point: Dot,
    circle: Circle,
    squircle: Squircle,
    triangle: Triangle,
    diamond: Diamond,
    hexagon: Hexagon,
    octagon: Octagon,
};

const SHAPE_LABELS: Record<NodeShapeType, string> = {
    point: 'Точка',
    circle: 'Круг',
    squircle: 'Сквиркл',
    triangle: 'Треугольник',
    diamond: 'Ромб',
    hexagon: 'Шестиугольник',
    octagon: 'Восьмиугольник',
};

export function getShape(type: NodeShapeType) {
    return {
        type,
        label: SHAPE_LABELS[type],
        icon: SHAPE_ICONS[type],
    };
}

export function getAllShapes(): NodeShapeType[] {
    return Object.keys(SHAPE_ICONS) as NodeShapeType[];
}
