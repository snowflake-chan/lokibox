import {
  applyAxisMovement,
  getBodyById,
  getCamera,
  getOthersBodies,
  getSelfBody,
  isTarget,
} from "src/tools/arch";
import { Vector3 } from "src/tools/vector3";
import { worldToScreen } from "src/tools/world2screen";
import { addTeammate, isTeammate} from "./teammates";

let handler: number | null = null;

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
    if (isTeammate(enemy.id)) continue;
    const p1 = new Vector3(enemy.px, enemy.py, enemy.pz);
    const p2 = new Vector3(self.px, self.py, self.pz);
    const dist = p1.sqrDist(p2);
    if (dist > range * range) continue;
    if (nearestDistance > dist * dist) {
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

    const self = getSelfBody();
    const camera = getCamera();
    if (!self || !camera) return;

    if (self) {
      const selfPos = [self.px, self.py, self.pz];
      const targetPos = [body.px, body.py, body.pz];

      if (!isTarget(selfPos, targetPos, camera, 90)) return;
    }

    const screenPos = worldToScreen(
      [body.px, body.py, body.pz],
      camera.viewProjection,
      camera.viewport,
    );

    if (screenPos) {
      const viewport = camera.viewport;
      const dx = screenPos.x - viewport[0] / 2;
      const dy = screenPos.y - viewport[1] / 2;
      applyAxisMovement(dx * currentStrength, dy * currentStrength);
    }
  }, 10);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "o" && targetId) {
    addTeammate(targetId);
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
