import { NODE_MOVE_MIN_STEP, NODE_MOVE_MAX_STEP } from '@/canvas/constants';
import { useCanvasStore } from '@/canvas/store/сanvasStore';

export function toggleMagnetMode() {
    const { isMagnet, setIsMagnet, setNodeMoveStep } = useCanvasStore.getState();

    const newMagnetState = !isMagnet;

    setIsMagnet(newMagnetState);
    setNodeMoveStep(newMagnetState ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP);
}
