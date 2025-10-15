/**
 * 自动瞄准模块
 * @module functions/aimassist
 */
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
import { addTeammate, isTeammate } from "./teammates";
import { activateShortcut } from "./shortcut";

let handler: number | null = null;

let currentRange: number = 5;
let currentStrength: number = 0.1;
let targetId: number | null = null;

/**
 * 获取范围内最近的敌人
 * @param range 有效范围
 * @returns 目标敌人ID
 */
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

/**部署AimAssist */
export function deployAimAssist() {
  clearAimAssist();

  handler = setInterval(() => {
    targetId = getNearestEnemyInRange(currentRange);

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

    const screenPos = worldToScreen(body.px, body.py, body.pz);

    if (screenPos) {
      const viewport = camera.viewport;
      const dx = screenPos.x - viewport[0] / 2;
      const dy = screenPos.y - viewport[1] / 2;
      applyAxisMovement(dx * currentStrength, dy * currentStrength);
    }
  }, 10);
}

//设置Teammate快捷键
window.addEventListener("keydown", (e) => {
  if (e.key === "o" && targetId) {
    addTeammate(targetId);
    console.log(`Added ${targetId} to blacklist`);
  }
});

/**清除AimAssist */
export function clearAimAssist() {
  if (handler) {
    clearInterval(handler);
    handler = null;
  }
}

/**
 * 设置自动瞄准半径
 * @param range 范围
 */
export function setAimRange(range: number) {
  currentRange = range;
}

/**
 * 设置自动瞄准力度
 * @param strength 力度
 */
export function setAimStrength(strength: number) {
  currentStrength = strength;
}

activateShortcut("AimAssist", deployAimAssist, clearAimAssist);