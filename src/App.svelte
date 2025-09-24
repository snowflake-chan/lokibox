<script lang="ts">
  import Menu from "./components/Menu.svelte";
  import { GM_getValue } from "$";
  import { bind as bindMovement } from "src/menus/movement";
  import { bind as bindCombat } from "src/menus/combat";
  import { bind as bindCamera } from "src/menus/camera";
  import { bind as bindShortcut } from "src/menus/shortcut";
  import { defaultShortcut } from "./tools/defaults";
  import { coreService } from "src/services/coreService";
  import { shortcutStore } from "src/functions/shortcut";
  import { onMount, onDestroy } from "svelte";

  let movementMenu: Menu | undefined;
  let combatMenu: Menu | undefined;
  let cameraMenu: Menu | undefined;
  let shortcutMenu: Menu | undefined;
  let shortcut = GM_getValue("shortcut", defaultShortcut);

  const unsubShortcut = shortcutStore.subscribe((v) => {
    Object.assign(shortcut, v);
  });

  let doHideMenu = true;

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === shortcut.openMenu) {
      doHideMenu = !doHideMenu;
      (document as any).exitPointerLock?.();
    }
    if (!doHideMenu && e.key === "Escape") {
      doHideMenu = true;
    }
  }

  function preventContext(e: Event) {
    e.preventDefault();
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("contextmenu", preventContext);
    coreService.getCore().then(async () => {
      await waitUntil(() => !(!movementMenu || !cameraMenu || !shortcutMenu));
      console.log("LokiBox Menu Loaded");
      if (!movementMenu || !combatMenu || !cameraMenu || !shortcutMenu) return;

      bindMovement(movementMenu);
      bindCombat(combatMenu);
      bindCamera(cameraMenu);
      bindShortcut(shortcutMenu);
    }).catch((e) => {
      console.warn("coreService initialization failed:", e);
    });
  });

  onDestroy(() => {
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("contextmenu", preventContext);
    unsubShortcut();
  });

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
</script>

<main>
  <div id="root" class:transparent={doHideMenu}>
    <Menu title="Movement" bind:this={movementMenu}></Menu>
    <Menu title="Combat" bind:this={combatMenu}></Menu>
    <Menu title="Camera" bind:this={cameraMenu}></Menu>
    <Menu title="Shortcut" bind:this={shortcutMenu}></Menu>
  </div>
  <Radar></Radar>
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
</style>