'use client';

interface TooltipProps {
    label: string;
    children: React.ReactNode;
}

export const Tooltip = ({ label, children }: TooltipProps) => {
    return (
        <div className="relative group">
            {children}
            <span className="absolute top-10 right-1/2 translate-x-1/2 px-2 py-1 text-xs text-foreground bg-background-alt border border-border rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none select-none">
                {label}
            </span>
        </div>
    );
};
