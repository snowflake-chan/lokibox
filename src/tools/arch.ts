import { coreService } from "src/services/coreService";
import { Vector3 } from "./vector3";

export function getSelfBody(): Body {
  const state = coreService.getStateSync();
  const id = state.secret.id;
  return state.bodies.find((v) => v.id === id)!;
}

export function getVoxelShape(): Vector3 {
  const state = coreService.getStateSync();
  return Vector3.parseArray(state.voxel.shape);
}
