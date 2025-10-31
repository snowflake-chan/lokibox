/**
 * 雷达控制
 * @module components/radar
 */
import { Application, Container, Graphics } from "pixi.js";
import { isTeammate } from "src/functions/teammates";
import { getTeleportPointList } from "src/functions/tppoint";
import {
  getCameraRotation,
  getOthersBodies,
  getSelfBody,
} from "src/tools/arch";

/**@class 雷达类 */
export class Radar {
  container: HTMLDivElement;
  player: Body;
  app: Application;
  radarSize = 200;
  maximized = false;
  worldContainer: Container;
  dots: Graphics[] = [];
  mapScale = 1;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.player = getSelfBody();
    this.app = new Application();
    this.worldContainer = new Container();
  }

  /**
   * 挂载雷达地图
   */
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

  /**绘制玩家箭头 */
  drawPlayerArrow(g: Graphics) {
    g.clear()
      .moveTo(0, -8)
      .lineTo(6, 6)
      .lineTo(0, 4)
      .lineTo(-6, 6)
      .closePath()
      .fill({ color: 0xffffff, alpha: 0.7 });
  }

  /**更新雷达内容 */
  updateRadar() {
    const player = this.player;
    const enemies = getOthersBodies();

    // let maxDist = 0;

    // //计算地图尺寸
    // enemies.forEach((e) => {
    //   const dx = e.px - player.px;
    //   const dy = e.py - player.py;
    //   const dz = e.pz - player.pz;
    //   const dist = Math.hypot(dx, dy, dz);
    //   if (dist > maxDist) maxDist = dist;
    // });

    // this.mapScale = 100 / maxDist;

    // console.log(`mapScale: ${this.mapScale}`)

    //销毁原标记点
    this.dots.forEach((dot) => dot.destroy());
    this.dots = [];

    //标记敌人
    enemies.forEach((e) => {
      if (isTeammate(e.id)) {
        this.drawPoint(e.px, e.pz, 0x00cc00);
      } else {
        this.drawPoint(e.px, e.pz, 0xcc0000);
      }
    });

    //标记传送点
    getTeleportPointList().forEach((v) => {
      this.drawPoint(v.x, v.z, 0xcc00cc);
    });
  }

  /**
   * 绘制一个点
   * @param x X坐标
   * @param z Z坐标
   * @param color 颜色
   */
  drawPoint(x: number, z: number, color: number) {
    const dx = x - this.player.px;
    const dy = z - this.player.pz;
    const yaw = getCameraRotation().getYaw();
    const cos = Math.cos(-yaw);
    const sin = Math.sin(-yaw);
    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;

    const dot = new Graphics();
    dot.circle(0, 0, 4);
    dot.fill({ color, alpha: 0.7 });

    dot.x = this.radarSize / 2 + rx * this.mapScale;
    dot.y = this.radarSize / 2 + ry * this.mapScale;
    this.worldContainer.addChild(dot);
    this.dots.push(dot);
  }

  destroy() {
    this.app.ticker.stop();
    this.app.destroy(true, { children: true });
    this.dots.forEach((dot) => dot.destroy());
  }
}
