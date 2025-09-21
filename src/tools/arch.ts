import { getCore } from "src/core";
import { Vector3 } from "./vector3";

var state: State;
getCore().then((core) => {
  state = (core as Core).game.state;
});

export function getSelfBody(): Body {
  const id = state.secret.id;
  return state.bodies.find((v) => v.id === id)!;
}

export function getVoxelShape(): Vector3 {
  return Vector3.parseArray(state.voxel.shape);
}
