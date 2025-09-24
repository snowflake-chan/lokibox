import { coreService } from "src/services/coreService";

export function setCameraTargetId(id: number) {
  const state = coreService.getStateSync();
  state.secret.replica.camera.targetId = id;
}

export function setCameraMode(mode: number) {
  const state = coreService.getStateSync();
  state.secret.replica.camera.mode = mode;
}

export function setCameraFovY(fovY: number) {
  const state = coreService.getStateSync();
  state.secret.replica.camera.fovY = fovY;
}

export function getPlayerId(): number {
  const state = coreService.getStateSync();
  return state.secret.id;
}