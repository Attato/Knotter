interface EmptyStateProps {
    message: string;
    className?: string;
}

export const EmptyState = ({ message, className = '' }: EmptyStateProps) => {
    return (
        <div className={`flex flex-col justify-center items-center h-full text-gray text-sm text-center p-2 ${className}`}>
            {message}
        </div>
    );
};
