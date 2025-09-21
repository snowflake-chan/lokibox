<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Application, Graphics, Container } from "pixi.js";
  import { getCore } from "src/core";
  import { Quaternion } from "src/tools/quaternion";

  let container: HTMLDivElement;
  let app: Application;

  let player: Body;
  let state: State;
  let camera: Camera;
  let enemies: Body[] = [];

  const radarSize = 200;
  let worldScale = 0.2; // 初始缩放
  const minScale = 0.05; // 最小缩放
  const maxScale = 0.5; // 最大缩放

  let playerArrow: Graphics;
  let enemyDots: Graphics[] = [];
  let worldContainer: Container;

  onMount(async () => {
    app = new Application();
    await app.init({
      width: radarSize,
      height: radarSize,
      backgroundAlpha: 0,
    });
    container.appendChild(app.canvas);

    worldContainer = new Container();
    app.stage.addChild(worldContainer);

    // 背景
    const bg = new Graphics();
    bg.beginFill(0x000000, 0.3);
    bg.lineStyle(2, 0xaaaaaa);
    bg.drawCircle(radarSize / 2, radarSize / 2, radarSize / 2);
    bg.endFill();
    worldContainer.addChild(bg);

    // 玩家箭头
    playerArrow = new Graphics();
    drawPlayerArrow(playerArrow);
    playerArrow.x = radarSize / 2;
    playerArrow.y = radarSize / 2;
    playerArrow.rotation = 0;
    app.stage.addChild(playerArrow);

    app.ticker.add(() => {
      updateRadar();
    });
  });

  function drawPlayerArrow(g: Graphics) {
    g.clear();
    g.beginFill(0xffffff, 0.7);
    g.moveTo(0, -8);
    g.lineTo(6, 6);
    g.lineTo(-6, 6);
    g.closePath();
    g.endFill();
  }

  function updateRadar() {
    if (!app) return;
    if (state) {
      enemies = state.bodies.filter((v) => {
        if (v.id != player.id) return state.playerIndex[v.id];
      });
    }

    // 计算最远敌人距离，用于动态缩放
    let maxDistance = 50; // 默认
    if (enemies.length > 0) {
      maxDistance = Math.max(
        ...enemies.map((e) => Math.hypot(e.px - player.px, e.pz - player.pz))
      );
    }

    // 动态缩放，保证最远敌人落在雷达边缘以内
    worldScale = Math.min(
      maxScale,
      Math.max(minScale, radarSize / 2 / (maxDistance * 1.1))
    );

    // 清除旧敌人
    enemyDots.forEach((dot) => dot.destroy());
    enemyDots = [];

    // 绘制敌人
    enemies.forEach((e) => {
      const dx = e.px - player.px;
      const dy = e.pz - player.pz;
      const yaw = Quaternion.parseArray(camera.rotation).getYaw();
      const cos = Math.cos(-yaw);
      const sin = Math.sin(-yaw);
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;

      const dot = new Graphics();
      dot.beginFill(0xcc0000, 0.7);
      dot.drawCircle(0, 0, 4);
      dot.endFill();
      dot.x = radarSize / 2 + rx * worldScale;
      dot.y = radarSize / 2 + ry * worldScale;
      worldContainer.addChild(dot);
      enemyDots.push(dot);
    });

    // 玩家箭头永远居中朝上
    playerArrow.x = radarSize / 2;
    playerArrow.y = radarSize / 2;
    playerArrow.rotation = 0;
  }

  getCore().then((core) => {
    state = (core as Core).game.state;
    camera = state.camera;
    const playerId = state.secret.id;
    const body = state.bodies.find((v) => v.id == playerId);

    if (!body) return;
    player = body;
  });

  let coords = "";

  const updateCoords = () => {
    coords = `(${player.px.toFixed(2)}, ${player.py.toFixed(2)}, ${player.pz.toFixed(2)})`;
  };

  // 定时刷新
  const interval = setInterval(updateCoords, 50);

  onDestroy(() => clearInterval(interval));
</script>

<div id="radar-container">
  <div bind:this={container} id="radar"></div>
  {#if player}
    <div id="coordinates">
      {coords}
    </div>
  {/if}
</div>

<style lang="scss">
  #radar {
    position: absolute;
    left: 0;
    width: 200px;
    height: 200px;
    z-index: 998;
    top: 0;
  }

  #radar-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 998;
  }

  #coordinates {
    position: absolute;
    top: 205px;
    font-size: medium;
    z-index: 998;
    color: white;
  }
</style>
