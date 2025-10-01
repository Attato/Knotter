import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useToast } from '@/components/UI/Toast';
import type { CanvasItem } from '@/canvas/canvas.types';

const FILE_TYPES: FilePickerAcceptType[] = [
    {
        description: 'Knotter JSON',
        accept: { 'application/json': ['.knotter.json'] },
    },
];

export function useCanvasFileActions() {
    const { setItems } = useCanvasStore();
    const { addToast } = useToast();

    const isFileSystemAccessSupported = () => 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;

    const handleOpen = async () => {
        try {
            let file: File | undefined;

            if (isFileSystemAccessSupported()) {
                const [fileHandle] = await showOpenFilePicker({
                    types: FILE_TYPES,
                    multiple: false,
                });
                file = await fileHandle.getFile();
            } else {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.knotter.json';
                input.style.display = 'none';
                document.body.appendChild(input);
                input.click();

                file = await new Promise<File | undefined>((resolve) => {
                    input.onchange = () => resolve(input.files?.[0] ?? undefined);
                });

                document.body.removeChild(input);
            }

            if (!file) {
                addToast('Открытие файла отменено пользователем', 'info');
                return;
            }

            const parsed = JSON.parse(await file.text()) as {
                state?: { items: CanvasItem[] };
                items?: CanvasItem[];
            };

            const items = parsed.state?.items ?? parsed.items ?? [];
            if (!Array.isArray(items)) {
                addToast('Неверный формат файла', 'error');
                return;
            }

            localStorage.setItem('canvas-storage', JSON.stringify(parsed));
            setItems(items);
            addToast('Файл успешно загружен', 'success');
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                addToast('Открытие файла отменено пользователем', 'info');
            } else {
                console.error('Ошибка при открытии файла:', err);
                addToast('Ошибка при открытии файла', 'error');
            }
        }
    };

    const handleSaveAs = async () => {
        try {
            const rawData = localStorage.getItem('canvas-storage');
            if (!rawData) {
                addToast('Нет данных для сохранения', 'error');
                return;
            }

            const parsed = JSON.parse(rawData) as {
                state?: { items: CanvasItem[] };
                items?: CanvasItem[];
            };

            const items = parsed.state?.items ?? parsed.items ?? [];
            if (items.length === 0) {
                addToast('Нет элементов для сохранения', 'error');
                return;
            }

            const blob = new Blob([JSON.stringify({ items }, null, 2)], {
                type: 'application/json',
            });

            if (isFileSystemAccessSupported()) {
                const fileHandle = await showSaveFilePicker({
                    suggestedName: 'Файл1.knotter.json',
                    types: FILE_TYPES,
                });
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Файл1.knotter.json';
                a.click();
                URL.revokeObjectURL(url);
            }

            addToast('Файл успешно сохранен', 'success');
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                addToast('Сохранение отменено пользователем', 'info');
            } else {
                console.error('Ошибка сохранения:', err);
                addToast('Ошибка сохранения файла', 'error');
            }
        }
    };

    return { handleOpen, handleSaveAs };
}
