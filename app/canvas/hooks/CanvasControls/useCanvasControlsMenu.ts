import { useState, useRef, useCallback, useMemo } from 'react';

import { useClickOutside } from '@/canvas/hooks/useClickOutside';
import { useCanvasFileActions } from '@/canvas/hooks/CanvasControls/useCanvasFileActions';

import { useCanvasStore } from '@/canvas/store/canvasStore';

export function useCanvasControlsMenu() {
    const [open, setOpen] = useState(false);
    const [showSavePopup, setShowSavePopup] = useState(false);

    const pendingActionRef = useRef<(() => void) | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(
        menuRef,
        useCallback(() => setOpen(false), []),
    );

    const { handleOpen, handleSaveAs } = useCanvasFileActions();
    const fileActions = useMemo(() => ({ handleOpen, handleSaveAs }), [handleOpen, handleSaveAs]);

    const hasUnsavedChanges = useCanvasStore((state) => state.items !== state.savedItems);
    const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
    hasUnsavedChangesRef.current = hasUnsavedChanges;

    const withSaveCheck = useCallback((action: () => void) => {
        if (hasUnsavedChangesRef.current) {
            pendingActionRef.current = action;
            setShowSavePopup(true);
        } else {
            action();
        }
    }, []);

    const onOpenProject = useCallback(() => withSaveCheck(fileActions.handleOpen), [withSaveCheck, fileActions]);
    const onSaveAs = useCallback(() => withSaveCheck(fileActions.handleSaveAs), [withSaveCheck, fileActions]);

    const handleSaveAndProceed = useCallback(async () => {
        if (!pendingActionRef.current) return;

        await fileActions.handleSaveAs();
        setShowSavePopup(false);

        const action = pendingActionRef.current;
        pendingActionRef.current = null;
        await action();
    }, [fileActions]);

    const handleDiscardAndProceed = useCallback(() => {
        setShowSavePopup(false);
        const action = pendingActionRef.current;
        pendingActionRef.current = null;
        action?.();
    }, []);

    const handleCancel = useCallback(() => {
        setShowSavePopup(false);
        pendingActionRef.current = null;
    }, []);

    const toggleMenu = useCallback(() => setOpen((p) => !p), []);

    return {
        open,
        showSavePopup,
        menuRef,
        onOpenProject,
        onSaveAs,
        handleSaveAndProceed,
        handleDiscardAndProceed,
        handleCancel,
        toggleMenu,
        setOpen,
    };
}
