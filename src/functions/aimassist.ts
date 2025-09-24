import { coreService } from "src/services/coreService";
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
  try {
    const state = coreService.getStateSync();
    const playerId = state.secret.id;
    const playerBody = state.bodies.find((v) => v.id === playerId);
    if (!playerBody) return null;

    const enemies = state.replica.players.filter((p) => p.id !== playerId);
    let nearestEnemyId: number | null = null;
    let minDistance = range;

    for (const enemy of enemies) {
      const enemyBody = state.bodies.find((b) => b.id === enemy.id);
      if (!enemyBody) continue;
      if (blackList.includes(enemy.id)) continue;

      const dx = playerBody.px - enemyBody.px;
      const dy = playerBody.py - enemyBody.py;
      const dz = playerBody.pz - enemyBody.pz;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < minDistance) {
        minDistance = distance;
        nearestEnemyId = enemy.id;
      }
    }

    return nearestEnemyId;
  } catch (error) {
    console.error("getNearestEnemyInRange failed:", error);
    return null;
  }
}

export function deployAimAssist() {
  clearAimAssist();

  handler = setInterval(() => {
    try {
      const state = coreService.getStateSync();

      if (currentMode === AimMode.TARGET) {
        targetId = currentTarget;
      } else if (currentMode === AimMode.RANGE) {
        targetId = getNearestEnemyInRange(currentRange);
      }

      if (!targetId) return;

      const body = state.bodies.find((v) => v.id == targetId);
      if (!body) return;

      const camera = state.camera;
      const screenPos = worldToScreen([body.px, body.py, body.pz], camera);

      if (screenPos) {
        const dx = screenPos.x - camera.viewport[0] / 2;
        const dy = screenPos.y - camera.viewport[1] / 2;

        coreService.getCore().then((coreInstance) => {
          coreInstance.game.input._applyAxisMovement(
            dx * currentStrength,
            dy * currentStrength
          );
        }).catch(console.error);
      }
    } catch (error) {
      console.error("Aim assist tick error:", error);
      clearAimAssist();
    }
  }, 10);
}

window.addEventListener("keydown", (e) => {
  console.log(e.key, targetId)
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
