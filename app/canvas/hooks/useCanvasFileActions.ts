import { useCanvasStore } from '@/canvas/store/сanvasStore';

export function useCanvasFileActions() {
    const { setItems } = useCanvasStore();

    const handleOpen = async () => {
        try {
            let file: File | undefined;

            if ('showOpenFilePicker' in window) {
                const [fileHandle]: FileSystemFileHandle[] = await (
                    window as unknown as {
                        showOpenFilePicker: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
                    }
                ).showOpenFilePicker({
                    types: [{ description: 'Knotter JSON', accept: { 'application/json': ['.knotter.json'] } }],
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
                    input.onchange = () => resolve(input.files?.[0]);
                });

                document.body.removeChild(input);
            }

            if (!file) return;

            const text = await file.text();
            const parsed = JSON.parse(text);

            localStorage.setItem('canvas-storage', JSON.stringify(parsed));
            setItems(parsed.state?.items ?? parsed.items ?? []);

            console.log('Файл успешно загружен');
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                console.log('Открытие файла отменено пользователем');
            } else {
                console.error('Ошибка при открытии файла:', err);
            }
        }
    };

    const handleSaveAs = async () => {
        try {
            const rawData = localStorage.getItem('canvas-storage');
            if (!rawData) return;

            const items = JSON.parse(rawData).state?.items ?? JSON.parse(rawData).items;
            if (!items) return;

            const blob = new Blob([JSON.stringify({ items }, null, 2)], { type: 'application/json' });

            if ('showSaveFilePicker' in window) {
                const fileHandle: FileSystemFileHandle = await window.showSaveFilePicker({
                    suggestedName: 'Файл1.knotter.json',
                    types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
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
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                console.log('Сохранение отменено пользователем');
            } else {
                console.error('Ошибка сохранения:', err);
            }
        }
    };

    return { handleOpen, handleSaveAs };
}
