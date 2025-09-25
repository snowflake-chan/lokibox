import {
  applyAxisMovement,
  getBodyById,
  getCameraViewport,
  getCameraViewProjection,
  getOthersBodies,
  getSelfBody,
} from "src/tools/arch";
import { Vector3 } from "src/tools/vector3";
import { worldToScreen } from "src/tools/world2screen";

let handler: number | null = null;

const blackList: number[] = [];

export enum AimMode {
  TARGET = "target",
  RANGE = "range",
}

let currentMode: AimMode = AimMode.TARGET;
let currentTarget: number = 0;
let currentRange: number = 5;
let currentStrength: number = 0.1;
let targetId: number | null = null;

function getNearestEnemyInRange(range: number): number | null {
  const self = getSelfBody();

  let nearestDistance = Infinity;
  let nearestEnemyId: number | null = null;

  for (const enemy of getOthersBodies()) {
    const p1 = new Vector3(enemy.px, enemy.py, enemy.pz);
    const p2 = new Vector3(self.px, self.py, self.pz);
    const dist = p1.sqrDist(p2);
    if(dist > range * range) continue;
    if (nearestDistance > (dist * dist)) {
      nearestDistance = dist * dist;
      nearestEnemyId = enemy.id;
    }
  }

  return nearestEnemyId;
}

export function deployAimAssist() {
  clearAimAssist();

  handler = setInterval(() => {
    if (currentMode === AimMode.TARGET) {
      targetId = currentTarget;
    } else if (currentMode === AimMode.RANGE) {
      targetId = getNearestEnemyInRange(currentRange);
    }

    if (!targetId) return;

    const body = getBodyById(targetId);
    if (!body) {
      clearAimAssist();
      return;
    }

    const screenPos = worldToScreen(
      [body.px, body.py, body.pz],
      getCameraViewProjection(),
      getCameraViewport()
    );

    if (screenPos) {
      const viewport = getCameraViewport();
      const dx = screenPos.x - viewport[0] / 2;
      const dy = screenPos.y - viewport[1] / 2;
      applyAxisMovement(dx * currentStrength, dy * currentStrength);
    }
  }, 10);
}

window.addEventListener("keydown", (e) => {
  console.log(e.key, targetId);
  if (e.key === "o" && targetId) {
    blackList.push(targetId);
    console.log(`Added ${targetId} to blacklist`);
  }
});

export function clearAimAssist() {
  if (handler) {
    clearInterval(handler);
    handler = null;
  }
}

export function setAimMode(mode: AimMode) {
  currentMode = mode;
}

export function setAimTarget(target: number) {
  currentTarget = target;
}

export function setAimRange(range: number) {
  currentRange = range;
}

export function setAimStrength(strength: number) {
  currentStrength = strength;
}

export function clearBlacklist() {
  blackList.length = 0;
}
