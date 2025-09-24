'use client';

import { useTheme } from 'next-themes';

import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md bg-card hover:bg-ui border border-border cursor-pointer"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}
