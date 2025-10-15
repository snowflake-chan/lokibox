<script lang="ts">
  import Menu from "./components/Menu.svelte";
  import { bind as bindMovement } from "src/menus/movement";
  import { bind as bindCombat } from "src/menus/combat";
  import { bind as bindCamera } from "src/menus/camera";
  import { bind as bindShortcut } from "src/menus/shortcut";
  import { getCore } from "src/tools/core";
  import { activateShortcut } from "src/functions/shortcut";
  import { onMount, onDestroy } from "svelte";

  let movementMenu: Menu | undefined;
  let combatMenu: Menu | undefined;
  let cameraMenu: Menu | undefined;
  let shortcutMenu: Menu | undefined;
  let functionList: FunctionList | undefined;
  let ESPContainer: HTMLDivElement;

  let isResolved = false;

  let doHideMenu = true;

  activateShortcut(
    "Menu",
    () => {
      doHideMenu = false;
      (document as any).exitPointerLock?.();
    },
    () => {
      doHideMenu = true;
    }
  );

  function handleKeydown(e: KeyboardEvent) {
    //按ESC关闭菜单
    if (!doHideMenu && e.key === "Escape") {
      doHideMenu = true;
    }
  }

  /**禁止右键默认菜单*/
  function preventContext(e: Event) {
    e.preventDefault();
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("contextmenu", preventContext);
    getCore().then(async () => {
      isResolved = true;

      //挂载菜单
      await waitUntil(
        () => !(!movementMenu || !cameraMenu || !shortcutMenu || !combatMenu)
      );
      console.log("LokiBox Menu Loaded");

      //激活ESP
      activateESP(ESPContainer);

      bindMovement(movementMenu!);
      bindCombat(combatMenu!);
      bindCamera(cameraMenu!);
      bindShortcut(shortcutMenu!);
    });
  });

  /**销毁事件挂载*/
  onDestroy(() => {
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("contextmenu", preventContext);
  });

  /**
   * 轮询直到满足条件
   * @param condition 条件
   * @param [interval=50] 轮询间隔
   */
  function waitUntil(condition: () => boolean, interval = 50): Promise<void> {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (condition()) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  }

  import Radar from "./components/Radar.svelte";
  import FunctionList from "./components/FunctionList.svelte";
  import { activateESP } from "./functions/esp";
</script>

<main>
  {#if isResolved}
    <div id="root" class:transparent={doHideMenu}>
      <Menu title="Movement" bind:this={movementMenu}></Menu>
      <Menu title="Combat" bind:this={combatMenu}></Menu>
      <Menu title="Camera" bind:this={cameraMenu}></Menu>
      <Menu title="Shortcut" bind:this={shortcutMenu}></Menu>
    </div>
    <Radar></Radar>
    <FunctionList></FunctionList>
    <div id="esp-container" bind:this={ESPContainer}></div>
  {/if}
</main>

<style lang="scss">
  #root {
    z-index: 999;
    background-color: black;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;

    &.transparent {
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }

    &:not(.transparent) {
      opacity: 1;
      transition: opacity 0.3s;
    }
  }

  #esp-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 0 0 0 0;
    pointer-events: none;
    z-index: 996;
  }
</style>
