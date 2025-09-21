import { getCore } from "src/core";
import { worldToScreen } from "src/tools/world2screen";

var core: Core;
var handler: number;

getCore().then((v) => {
  core = v as Core;
});

export function deployAimAssist(target: number, strength: number) {
  const camera = core.game.state.camera;
  const body = core.game.state.bodies.find((v) => v.id == target);
  if (!body) return;
  console.log(body);
  handler = setInterval(() => {
    const screenPos = worldToScreen([body.px, body.py, body.pz], camera);
    console.log(screenPos);
    if (screenPos) {
      const dx = screenPos.x - camera.viewport[0] / 2;
      const dy = screenPos.y - camera.viewport[1] / 2;
      core.game.input._applyAxisMovement(dx * strength, dy * strength); // 自动修正瞄准
    }
  }, 10);
}

export function clearAimAssist() {
  if (!handler) return;
  clearInterval(handler);
}
