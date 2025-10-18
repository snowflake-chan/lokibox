/**
 * ESP透视模块
 * @module functions/esp
 */
import { Application, Graphics, Ticker } from "pixi.js";
import { getCamera, getOthersBodies, getSelfBody, isTarget } from "src/tools/arch";
import { worldToScreen } from "src/tools/world2screen";
import { isTeammate, addTeammate } from "./teammates";

const app = new Application();
app.init({ resizeTo: window, backgroundAlpha: 0 });

const espList: { g: Graphics; id: number; r: { x: number; y: number; w: number; h: number } }[] = [];
let curTarget: number | null = null;

/**更新ESP */
function updateESP() {
  const player = getSelfBody();
  const camera = getCamera();
  if (!player || !camera) return;

  espList.forEach((v) => v.g.destroy());
  espList.length = 0;
  curTarget = null;

  const cx = camera.viewport[0] / 2;
  const cy = camera.viewport[1] / 2;

  const targets = getOthersBodies().filter((e) => {
    const dx = e.px - player.px;
    const dy = e.py - player.py;
    const dz = e.pz - player.pz;
    return Math.hypot(dx, dy, dz) < 20;
  });

  targets.forEach((v) => {
    const headPos = worldToScreen(v.px, v.py + 1, v.pz);
    const footPos = worldToScreen(v.px, v.py - 1, v.pz);
    if (headPos && footPos && isTarget([player.px, player.py, player.pz], [v.px, v.py, v.pz], camera)) {
      const h = Math.abs(headPos.y - footPos.y);
      const w = h / 2;
      const x = headPos.x - w / 2;
      const y = headPos.y;

      const g = new Graphics();
      g.rect(x, y, w, h);
      g.stroke({ color: isTeammate(v.id) ? 0x00cc00 : 0xcc0000, alpha: 0.7, width: 5 });
      app.stage.addChild(g);

      espList.push({ g, id: v.id, r: { x, y, w, h } });

      if (cx >= x && cx <= x + w && cy >= y && cy <= y + h) {
        curTarget = v.id;
      }
    }
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "o" && curTarget) {
    addTeammate(curTarget);
    console.log(`Added ${curTarget} to teammates`);
  }
});

/**激活ESP */
export function activateESP(container: HTMLDivElement) {
  Ticker.shared.add(updateESP);
  container.appendChild(app.canvas);
}
