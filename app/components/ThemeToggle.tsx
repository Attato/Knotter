'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect, memo } from 'react';

interface ThemeToggleProps {
    label?: string;
    className?: string;
}

export const ThemeToggle = memo(function ThemeToggle({ label, className }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted || !resolvedTheme) return null;

    return (
        <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className={`
                p-2 rounded-md bg-depth-2 hover:bg-depth-3 cursor-pointer flex items-center 
                ${className}
            `}
            aria-label="Toggle theme"
        >
            {label && <span className="mr-2">{label}</span>}

            {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
});
