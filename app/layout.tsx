'use client';

import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import '@/globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['100', '200', '300', '400', '700'] });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning translate="no">
            <body className={inter.className}>
                <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem={true}>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
