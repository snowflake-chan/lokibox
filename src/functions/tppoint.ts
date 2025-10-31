import type { Vector3 } from "src/tools/vector3";

const pointList: Vector3[] = [];

export function getTeleportPointList() {
  return pointList;
}

export function addTeleportPoint(point: Vector3) {
  pointList.push(point);
}
