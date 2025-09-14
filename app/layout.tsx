'use client'; // обязательно для ThemeProvider

import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'], weight: ['100', '400', '700'] });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem={true}>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
