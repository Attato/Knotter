'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type DropdownProps = {
    title: string;
    children: React.ReactNode;
};

export default function Dropdown({ title, children }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col gap-1 bg-card rounded-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-start gap-2 items-center px-3 py-2 w-full cursor-pointer text-sm"
            >
                <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
                {title}
            </button>

            {isOpen && <div className="flex flex-col gap-2 px-3 pb-2">{children}</div>}
        </div>
    );
}
