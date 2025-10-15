/**
 * ESP透视模块
 * @module functions/esp
 */
import { Application, Graphics, Ticker } from "pixi.js";
import { getCamera, getOthersBodies, getSelfBody, isTarget } from "src/tools/arch";
import { worldToScreen } from "src/tools/world2screen";
import { isTeammate } from "./teammates";

const app = new Application();
app.init({ resizeTo: window, backgroundAlpha: 0 });

const espList: Graphics[] = [];

/**更新ESP */
function updateESP() {
  const player = getSelfBody();
  espList.forEach((v) => {
    v.destroy();
  });
  const target = getOthersBodies().filter((e) => {
    const dx = e.px - player.px;
    const dy = e.py - player.py;
    const dz = e.pz - player.pz;
    const dist = Math.hypot(dx, dy, dz);
    return dist < 20;
  });
  target.forEach((v) => {
    const headPos = worldToScreen(v.px, v.py + 1, v.pz);
    const footPos = worldToScreen(v.px, v.py - 1, v.pz);
    if (headPos && footPos && isTarget([player.px,player.py,player.pz],[v.px,v.py,v.pz],getCamera())) {
      const height = Math.abs(headPos.y - footPos.y);
      const width = height / 2;
      const leftX = headPos.x - width / 2;
      const g = new Graphics();
      g.rect(leftX, headPos.y, width, height);
      if (isTeammate(v.id)) {
        g.stroke({ color: 0x00cc00, alpha: 0.7, width: 5 });
      } else {
        g.stroke({ color: 0xcc0000, alpha: 0.7, width: 5 });
      }
      espList.push(g);
      app.stage.addChild(g);
    }
  });
}

/**激活ESP */
export function activateESP(container: HTMLDivElement) {
  Ticker.shared.add(updateESP);
  container.appendChild(app.canvas);
}
