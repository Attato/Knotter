'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CircleCheck, CircleAlert, CircleMinus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
    id: string;
    message: string;
    type: ToastType;
    isLeaving: boolean;
    height: number;
};

type ToastContextType = {
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_STYLES = {
    base: 'absolute right-0 transition-all duration-400 ease-in-out',
    leaving: 'opacity-0 translate-y-6',
    visible: 'opacity-100 translate-y-0',

    container:
        'relative flex items-center gap-3 px-4 py-3 bg-depth-2 rounded-md shadow-lg backdrop-blur-sm min-w-xs max-w-sm transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer',

    icon: {
        base: 'flex-shrink-0',
        success: 'text-axis-x',
        error: 'text-axis-y',
        info: 'text-text-accent',
    },

    typeStyles: {
        success: {
            container: 'text-axis-x',
        },
        error: {
            container: 'text-axis-y',
        },
        info: {
            container: 'text-text-accent',
        },
    },
};

const ToastIcons = {
    success: CircleCheck,
    error: CircleMinus,
    info: CircleAlert,
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, isLeaving: true } : toast)));
        setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 400);
    }, []);

    const addToast = useCallback(
        (message: string, type: ToastType = 'info') => {
            const id = uuidv4();
            setToasts((prev) => [{ id, message, type, isLeaving: false, height: 0 }, ...prev]);
            setTimeout(() => removeToast(id), 4000);
        },
        [removeToast],
    );

    const updateToastHeight = useCallback((id: string, height: number) => {
        setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, height } : toast)));
    }, []);

    const getToastPositions = () => {
        let currentOffset = 16;
        return toasts.map((toast, index) => {
            const position = { bottom: currentOffset, zIndex: 50 - index };
            currentOffset += toast.height > 0 ? toast.height + 8 : 0;
            return position;
        });
    };

    const toastPositions = getToastPositions();

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}

            <div className="fixed bottom-0 right-0 p-4 z-50">
                <div className="relative">
                    {toasts.map((toast, index) => {
                        const typeStyle = TOAST_STYLES.typeStyles[toast.type];
                        const IconComponent = ToastIcons[toast.type];

                        return (
                            <div
                                key={toast.id}
                                className={`${TOAST_STYLES.base} ${
                                    toast.isLeaving ? TOAST_STYLES.leaving : TOAST_STYLES.visible
                                }`}
                                style={{ ...toastPositions[index], transition: 'all 0.4s ease-in-out' }}
                            >
                                <div
                                    ref={(el) => {
                                        if (el && toast.height === 0) {
                                            updateToastHeight(toast.id, el.offsetHeight);
                                        }
                                    }}
                                    className={`${TOAST_STYLES.container} ${typeStyle.container}`}
                                    onClick={() => removeToast(toast.id)}
                                >
                                    <IconComponent
                                        size={20}
                                        className={`${TOAST_STYLES.icon.base} ${TOAST_STYLES.icon[toast.type]}`}
                                    />

                                    <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) throw new Error('useToast не может использоваться без ToastProvider');

    return context;
}
