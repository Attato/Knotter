'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted || !resolvedTheme) return null;

    return (
        <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md bg-card hover:bg-ui border border-border cursor-pointer flex items-center justify-center"
            aria-label="Toggle theme"
        >
            {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}
