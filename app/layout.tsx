import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
    title: 'Knotter',
    description: 'Визуальный редактор для проектирования сложных систем в наглядном виде.',
};

const inter = Inter({ subsets: ['latin'], weight: ['100', '400', '700'] });

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
