import { Application, Container, Graphics } from "pixi.js";
import { isTeammate } from "src/functions/teammates";
import {
  getCameraRotation,
  getOthersBodies,
  getSelfBody,
} from "src/tools/arch";

export class Radar {
  container: HTMLDivElement;
  player: Body;
  app: Application;
  radarSize = 200;
  maximized = false;
  worldContainer: Container;
  enemyDots: Graphics[] = [];

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.player = getSelfBody();
    this.app = new Application();
    this.worldContainer = new Container();
  }
  async mount() {
    await this.app.init({
      width: this.radarSize,
      height: this.radarSize,
      backgroundAlpha: 0,
    });
    this.container.appendChild(this.app.canvas);

    this.app.stage.addChild(this.worldContainer);

    // 背景
    const bg = new Graphics();
    bg.circle(this.radarSize / 2, this.radarSize / 2, this.radarSize / 2)
      .stroke({ width: 2, color: 0xaaaaaa })
      .fill({ color: 0x000000, alpha: 0.3 });
    this.worldContainer.addChild(bg);

    // 玩家箭头
    const playerArrow = new Graphics();
    this.drawPlayerArrow(playerArrow);
    playerArrow.x = this.radarSize / 2;
    playerArrow.y = this.radarSize / 2;
    playerArrow.rotation = 0;
    this.app.stage.addChild(playerArrow);

    this.app.ticker.add(() => {
      this.updateRadar();
    });
  }
  drawPlayerArrow(g: Graphics) {
    g.clear()
      .moveTo(0, -8)
      .lineTo(6, 6)
      .lineTo(0, 4)
      .lineTo(-6, 6)
      .closePath()
      .fill({ color: 0xffffff, alpha: 0.7 });
  }

  updateRadar() {
    const player = this.player;
    const enemies = getOthersBodies();

    let maxDist = 0;
    enemies.forEach((e) => {
      const dx = e.px - player.px;
      const dy = e.py - player.py;
      const dz = e.pz - player.pz;
      const dist = Math.hypot(dx, dy, dz);
      if (dist > maxDist) maxDist = dist;
    });

    this.enemyDots.forEach((dot) => dot.destroy());
    this.enemyDots = [];

    enemies.forEach((e) => {
      const dx = e.px - player.px;
      const dy = e.pz - player.pz;
      const yaw = getCameraRotation().getYaw();
      const cos = Math.cos(-yaw);
      const sin = Math.sin(-yaw);
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;

      const dot = new Graphics();
      dot.circle(0, 0, 4);
      if (isTeammate(e.id)) {
        dot.fill({ color: 0x00cc00, alpha: 0.7 });
      } else {
        dot.fill({ color: 0xcc0000, alpha: 0.7 });
      }
      dot.x = this.radarSize / 2 + rx;
      dot.y = this.radarSize / 2 + ry;
      this.worldContainer.addChild(dot);
      this.enemyDots.push(dot);
    });
  }

  destroy() {
    this.app.ticker.stop();
    this.app.destroy(true, { children: true });
    this.enemyDots.forEach((dot) => dot.destroy());
  }
}
