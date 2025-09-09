import { NODE_MOVE_MIN_STEP, NODE_MOVE_MAX_STEP } from '@/canvas/constants';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export function toggleMagnetMode() {
    useCanvasStore.setState((state) => {
        const newMagnet = !state.isMagnet;

        return {
            isMagnet: newMagnet,
            nodeMoveStep: newMagnet ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP,
        };
    });
}
