import { Application, Graphics, Ticker } from "pixi.js";
import { getCamera, getOthersBodies, getSelfBody, isTarget } from "src/tools/arch";
import { worldToScreen } from "src/tools/world2screen";
import { isTeammate, addTeammate } from "./teammates";

const app = new Application();
app.init({ resizeTo: window, backgroundAlpha: 0 });

const espList: { graphic: Graphics; rect: { x: number; y: number; width: number; height: number } }[] = [];
let currentTargetInCrosshair: number | null = null;

function updateESP() {
  const player = getSelfBody();
  const camera = getCamera();
  if (!player || !camera) return;

  espList.forEach(v => v.graphic.destroy());
  espList.length = 0;
  currentTargetInCrosshair = null;

  const crosshairX = camera.viewport[0] / 2;
  const crosshairY = camera.viewport[1] / 2;

  const targets = getOthersBodies().filter(e => {
    const dx = e.px - player.px;
    const dy = e.py - player.py;
    const dz = e.pz - player.pz;
    return Math.hypot(dx, dy, dz) < 20;
  });

  for (const v of targets) {
    const headPos = worldToScreen(v.px, v.py + 1, v.pz);
    const footPos = worldToScreen(v.px, v.py - 1, v.pz);
    if (!headPos || !footPos || !isTarget([player.px, player.py, player.pz], [v.px, v.py, v.pz], camera)) continue;

    const height = Math.abs(headPos.y - footPos.y);
    const width = height / 2;
    const x = headPos.x - width / 2;
    const y = headPos.y;

    const g = new Graphics();
    g.rect(x, y, width, height);
    g.stroke({ color: isTeammate(v.id) ? 0x00cc00 : 0xcc0000, alpha: 0.7, width: 5 });
    app.stage.addChild(g);

    espList.push({ graphic: g, rect: { x, y, width, height } });

    if (crosshairX >= x && crosshairX <= x + width && crosshairY >= y && crosshairY <= y + height) {
      currentTargetInCrosshair = v.id;
    }
  }
}

window.addEventListener("keydown", e => {
  if (e.key === "o" && currentTargetInCrosshair) {
    addTeammate(currentTargetInCrosshair);
    console.log(`Added ${currentTargetInCrosshair} to blacklist(Not Aiming)`);
  }
});

export function activateESP(container: HTMLDivElement) {
  Ticker.shared.add(updateESP);
  container.appendChild(app.canvas);
}