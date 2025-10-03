import { Vector3 } from "./vector3";
import { Quaternion } from "./quaternion";
import { getCore } from "src/tools/core";

let core: Core;
let state: State;

getCore().then((v) => {
  core = v;
  state = v.game.state;
});

export function getSelfBody(): Body {
  const id = state.secret.id;
  return state.bodies.find((v) => v.id === id)!;
}

export function getVoxelShape(): Vector3 {
  return Vector3.parseArray(state.voxel.shape);
}

export function setCameraTargetId(id: number) {
  state.secret.replica.camera.targetId = id;
}

export function getCameraTargetId() {
  return state.secret.replica.camera.targetId;
}

export function setCameraMode(mode: number) {
  state.secret.replica.camera.mode = mode;
}

export function getCameraMode() {
  return state.secret.replica.camera.mode;
}

export function setCameraFovY(fovY: number) {
  state.secret.replica.camera.fovY = fovY;
}

export function getCameraFovY() {
  return state.secret.replica.camera.fovY;
}

export function getPlayerId(): number {
  return state.secret.id;
}

export function getPlayerMap(): Record<string, number> {
  const playerList: Record<string, number> = {};
  for (const p of state.replica.players) {
    playerList[p.name] = p.id;
  }
  return playerList;
}

export function getCameraRotation(): Quaternion {
  return Quaternion.parseArray(state.camera.rotation);
}

export function setCameraEye(x: number, y: number, z: number) {
  state.secret.replica.camera.eye = [x, y, z];
}

export function setCameraTarget(x: number, y: number, z: number) {
  state.secret.replica.camera.target = [x, y, z];
}

export function applyAxisMovement(x: number, y: number) {
  core.game.input._applyAxisMovement(x, y);
}

export function getCamera(): Camera {
  return state.camera;
}

export function getBodyById(id: number) {
  return state.bodies.find((v) => v.id === id);
}

export function getOthersBodies() {
  return state.bodies.filter((v) => {
    return v.id !== state.secret.id && state.playerIndex[v.id];
  });
}

export function setPosition(x: number, y: number, z: number) {
  const self = getSelfBody();
  self.px = x;
  self.py = y;
  self.pz = z;
}

export function setKeyState(key: GameKey, status: number) {
  state.input.keyState[key] = status;
}

export function isTarget(playerPos: number[], targetPos: number[], camera: Camera, maxAngle: number = 90): boolean {
  const cameraForward = [
    camera.viewProjection[8],
    camera.viewProjection[9],
    camera.viewProjection[10]
  ];
  const toTarget = [
    targetPos[0] - playerPos[0],
    targetPos[1] - playerPos[1],
    targetPos[2] - playerPos[2]
  ];
  const length = Math.sqrt(toTarget[0] ** 2 + toTarget[1] ** 2 + toTarget[2] ** 2);
  if (!length) return false;

  const toTargetNormalized = [
    toTarget[0] / length,
    toTarget[1] / length,
    toTarget[2] / length
  ];
  const dot = cameraForward[0] * toTargetNormalized[0] +
    cameraForward[1] * toTargetNormalized[1] +
    cameraForward[2] * toTargetNormalized[2];
  const angle = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
  return angle <= maxAngle;
}