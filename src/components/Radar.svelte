<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Application, Graphics, Container } from "pixi.js";
  import { getCameraRotation, getOthersBodies, getSelfBody } from "src/tools/arch";

  let container: HTMLDivElement;
  let app: Application | null = null;

  let player: Body = getSelfBody();
  let enemies: Body[] = [];

  const radarSize = 200;
  let worldScale = 0.2;
  const minScale = 0.05;
  const maxScale = 0.5;

  let playerArrow: Graphics | null = null;
  let enemyDots: Graphics[] = [];
  let worldContainer: Container | null = null;

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

    enemies = getOthersBodies();

    let maxDistance = 50;
    if (enemies.length > 0) {
      maxDistance = Math.max(
        ...enemies.map((e) => Math.hypot(e.px - player!.px, e.pz - player!.pz))
      );
    }

    worldScale = Math.min(
      maxScale,
      Math.max(minScale, radarSize / 2 / (maxDistance * 1.1))
    );

    enemyDots.forEach((dot) => dot.destroy());
    enemyDots = [];

    enemies.forEach((e) => {
      const dx = e.px - player!.px;
      const dy = e.pz - player!.pz;
      const yaw = getCameraRotation().getYaw();
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
      worldContainer!.addChild(dot);
      enemyDots.push(dot);
    });

    if (playerArrow) {
      playerArrow.x = radarSize / 2;
      playerArrow.y = radarSize / 2;
      playerArrow.rotation = 0;
    }
  }

  let coords = "";
  let coordInterval: any = null;

  const updateCoords = () => {
    if (player) {
      coords = `(${player.px.toFixed(2)}, ${player.py.toFixed(2)}, ${player.pz.toFixed(2)})`;
    }
  };

  onMount(() => {
    coordInterval = setInterval(updateCoords, 50);
  });

  onDestroy(() => {
    if (app) {
      app.ticker.stop();
      app.destroy(true, { children: true });
    }
    enemyDots.forEach((dot) => dot.destroy());
    clearInterval(coordInterval);
  });
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
