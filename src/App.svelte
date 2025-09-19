<script lang="ts">
  import { GUI } from "lil-gui";
  import {
    isResolved,
    jetPackSpeedStore,
    playerStore,
    targetIdStore,
    refreshPlayerList,
  } from "./func";
  import { tick, onMount } from "svelte";
  let menu: HTMLElement | undefined;
  const src = {
    jetPackSpeed: 1.5,
    teleport: {
      x: 128,
      y: 64,
      z: 128,
      teleport: function () {},
    },
    refreshPlayerList,
    players: {} as any,
  };

  isResolved.subscribe(async (v) => {
    if (v) {
      await tick();
      console.log("LokiBox Menu Loaded");
      const gui = new GUI({ container: menu });
      console.log(gui);
      gui.close();
      setupDrag(gui);

      gui.title("LokiBox");
      gui
        .addFolder("Properties")
        .add(src, "jetPackSpeed", 0.5, 10, 0.5)
        .name("JetPack.Speed")
        .onChange((v: number) => {
          jetPackSpeedStore.set(v);
        });
      const playersFolder = gui.addFolder("Players");
      playersFolder.add(src, "refreshPlayerList").name("Refresh");
      playersFolder.close();

      playerStore.subscribe((v) => {
        Object.assign(src.players, {});
        [...playersFolder.folders].forEach(f => f.destroy());
        for (const player of v) {
          src.players[player.id] = {
            setTargetId: function () {
              targetIdStore.set(player.id);
            },
          };
          const singlePlayerFolder = playersFolder.addFolder(player.name);
          singlePlayerFolder.add(src.players[player.id], "setTargetId").name("Set as camera target");
          singlePlayerFolder.close();
        }
      });
    }
  });

  let isDragging = false;
  let startX: number, startY: number;
  let initialLeft: number, initialTop: number;
  let isClick: boolean;

  function setupDrag(gui: GUI) {
    if (!menu) return;

    // 添加拖动事件监听
    gui.$title.draggable = true;
    gui.$title.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);

    const originalFunc = gui.openAnimated;
    gui.openAnimated = function (open?: boolean) {
      if (isClick) {
        return originalFunc.call(gui, open);
      }
      return this;
    };
  }
  function startDrag(e: MouseEvent) {
    if (!menu) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    // 获取当前位置
    const rect = menu.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    // 防止文本选择
    e.preventDefault();
    menu.style.cursor = "grabbing";
  }

  function drag(e: MouseEvent) {
    if (!isDragging || !menu) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    menu.style.left = `${initialLeft + dx}px`;
    menu.style.top = `${initialTop + dy}px`;
  }

  function stopDrag(e: MouseEvent) {
    isDragging = false;
    if (menu) {
      menu.style.cursor = "grab";
    }
    const distX = startX - e.clientX;
    const distY = startY - e.clientY;
    const dist = distX * distX + distY * distY;
    isClick = dist < 5;
  }

  // 组件卸载时清理事件监听
  onMount(() => {
    return () => {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    };
  });
</script>

<main>
  {#if $isResolved}
    <div id="menu" bind:this={menu}></div>
  {/if}
</main>

<style lang="scss">
  #menu {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 999;
    border-radius: 8px;
    overflow: hidden;
    transition:
      box-shadow 0.3s ease,
      width 0.3s ease,
      height 0.3s ease;
    &:hover {
      box-shadow: 0 0 10px 1px aqua;
    }
  }
</style>
