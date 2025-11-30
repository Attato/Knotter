import {
    Circle,
    Square,
    Triangle,
    Hexagon,
    Octagon,
    Diamond,
    Dot,
    X,
    Club,
    Heart,
    Spade,
    Pentagon,
    type LucideIcon,
} from 'lucide-react';

export type NodeShapeType =
    | 'triangle'
    | 'circle'
    | 'x'
    | 'square'
    | 'spade'
    | 'heart'
    | 'diamond'
    | 'club'
    | 'point'
    | 'pentagon'
    | 'hexagon'
    | 'octagon';

export const NODE_SHAPE_TYPES: NodeShapeType[] = [
    'triangle',
    'circle',
    'x',
    'square',
    'spade',
    'heart',
    'diamond',
    'club',
    'point',
    'pentagon',
    'hexagon',
    'octagon',
];

const SHAPES: Record<NodeShapeType, { label: string; icon: LucideIcon }> = {
    triangle: { label: 'Треугольник', icon: Triangle },
    circle: { label: 'Круг', icon: Circle },
    x: { label: 'Крест', icon: X },
    square: { label: 'Квадрат', icon: Square },
    spade: { label: 'Пики', icon: Spade },
    heart: { label: 'Червы', icon: Heart },
    diamond: { label: 'Бубны', icon: Diamond },
    club: { label: 'Трефы', icon: Club },
    point: { label: 'Точка', icon: Dot },
    pentagon: { label: 'Пятиугольник', icon: Pentagon },
    hexagon: { label: 'Шестиугольник', icon: Hexagon },
    octagon: { label: 'Восьмиугольник', icon: Octagon },
};

const DEFAULT_SHAPE = SHAPES[NODE_SHAPE_TYPES[0]];

export function getShape(type?: NodeShapeType | string) {
    if (!type || !(type in SHAPES)) {
        return DEFAULT_SHAPE;
    }

    return SHAPES[type as NodeShapeType];
}

export function getAllShapes(): NodeShapeType[] {
    return Object.keys(SHAPES) as NodeShapeType[];
}
