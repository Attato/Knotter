import { LucideIcon } from 'lucide-react';
import { Box, Link2, Hash, Type, FlagTriangleRight, List, Brackets, Bug } from 'lucide-react';

const dynamicIconMap: Record<string, LucideIcon> = {
    node: Box,
    edge: Link2,

    number: Hash,
    string: Type,
    boolean: FlagTriangleRight,
    enum: List,
    array: Brackets,

    bug: Bug,
};

export function useDynamicIcon(props: string): LucideIcon {
    return dynamicIconMap[props] || dynamicIconMap.bug;
}
