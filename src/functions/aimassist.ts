import { getCore } from "src/core";
import { worldToScreen } from "src/tools/world2screen";

var core: Core;
var handler: number;

getCore().then((v) => {
  core = v as Core;
});

export enum AimMode {
  TARGET = "target",
  RANGE = "range"
}

let currentMode: AimMode = AimMode.TARGET;
let currentTarget: number = 0;
let currentRange: number = 5;
let currentStrength: number = 0.1;

function getNearestEnemyInRange(range: number): number | null {
  const playerId = core.game.state.secret.id;
  const playerBody = core.game.state.bodies.find(v => v.id === playerId);
  if (!playerBody) return null;
  
  const enemies = core.game.state.replica.players.filter(p => p.id !== playerId);
  let nearestEnemyId: number | null = null;
  let minDistance = range;
  
  for (const enemy of enemies) {
    const enemyBody = core.game.state.bodies.find(b => b.id === enemy.id);
    if (!enemyBody) continue;
    
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
}

export function deployAimAssist() {
  clearAimAssist();
  handler = setInterval(() => {
    let targetId: number | null = null;
    if (currentMode === AimMode.TARGET) {
      targetId = currentTarget;
    } else if (currentMode === AimMode.RANGE) {
      targetId = getNearestEnemyInRange(currentRange);
    }
    if (!targetId) return;
    const body = core.game.state.bodies.find((v) => v.id == targetId);
    if (!body) return;
    const camera = core.game.state.camera;
    const screenPos = worldToScreen([body.px, body.py, body.pz], camera);
    if (screenPos) {
      const dx = screenPos.x - camera.viewport[0] / 2;
      const dy = screenPos.y - camera.viewport[1] / 2;
      core.game.input._applyAxisMovement(dx * currentStrength, dy * currentStrength);
    }
  }, 10);
}

export function clearAimAssist() {
  if (!handler) return;
  clearInterval(handler);
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
