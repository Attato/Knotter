import { memo } from 'react';

import { MenuContent } from '@/canvas/components/CanvasControlsMenuContent';
import { SavePopup } from '@/canvas/components/SavePopup';

import { useCanvasControlsMenu } from '@/canvas/hooks/useCanvasControlsMenu';

import { Menu } from 'lucide-react';

export const CanvasControlsMenu = memo(function CanvasControlsMenu() {
    const {
        open,
        showSavePopup,
        menuRef,
        onOpenProject,
        onSaveAs,
        handleSaveAndProceed,
        handleDiscardAndProceed,
        handleCancel,
        toggleMenu,
    } = useCanvasControlsMenu();

    return (
        <div className="flex flex-col gap-2 max-w-60 w-full" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className={`p-2 rounded-md w-fit cursor-pointer ${open ? 'bg-bg-accent text-white' : 'bg-card hover:bg-ui'}`}
            >
                <Menu size={16} />
            </button>

            {open && <MenuContent onOpenProject={onOpenProject} onSaveAs={onSaveAs} />}

            {showSavePopup && (
                <SavePopup onSave={handleSaveAndProceed} onDiscard={handleDiscardAndProceed} onCancel={handleCancel} />
            )}
        </div>
    );
});
