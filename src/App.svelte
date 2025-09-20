<script lang="ts">
  import {
    isResolved,
    jetPackSpeedStore,
    playerStore,
    targetIdStore,
    refreshPlayerList,
    deployAutoClicker,
    clearAutoClicker,
    shortcutStore,
  } from "./func";
  import Menu from "./components/Menu.svelte";
  import { GM_getValue, GM_setValue } from "$";

  let propertiesMenu: Menu | undefined;
  let playerMenu: Menu | undefined;
  let shortcutMenu: Menu | undefined;

  const shortcut = GM_getValue("shortcut", {
    openMenu: "Tab",
    jetPack: "r",
  });

  type PropertiesSettings = {
    jetPackSpeed: number;
    autoClickInterval: number;
    autoClickKey: number;
    deployAutoClicker: () => void;
    clearAutoClicker: () => void;
  };
  const propertiesSettings: PropertiesSettings = {
    jetPackSpeed: 1.5,
    autoClickInterval: 200,
    autoClickKey: 6,
    deployAutoClicker: function () {
      clearAutoClicker();
      deployAutoClicker(this.autoClickInterval, this.autoClickKey);
    },
    clearAutoClicker,
  };

  type SinglePlayerSettings = {
    setTargetId: () => void;
  };

  type PlayerSettings = {
    refreshPlayerList: () => void;
    players: SinglePlayerSettings[];
  };

  const playerSettings: PlayerSettings = {
    refreshPlayerList,
    players: [],
  };

  var doHideMenu = true;

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === shortcut.openMenu) {
      doHideMenu = !doHideMenu;
    }
    if (!doHideMenu && e.key === "Escape") {
      doHideMenu = true;
    }
  });

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  isResolved.subscribe(async (v) => {
    if (v) {
      await waitUntil(() => !(!propertiesMenu || !playerMenu || !shortcutMenu));
      console.log("LokiBox Menu Loaded");
      if (!propertiesMenu) return;
      if (!playerMenu) return;
      if (!shortcutMenu) return;

      //参数设置
      propertiesMenu
        //喷气背包
        //@ts-ignore
        .add(propertiesSettings, "jetPackSpeed", 0.5, 10, 0.5)
        .name("JetPack.Speed")
        .onChange((v: number) => {
          jetPackSpeedStore.set(v);
        });

      const autoClickMenu = propertiesMenu.addFolder("AutoClicker");
      autoClickMenu
        .add(propertiesSettings, "autoClickInterval", 50, 2000, 10)
        .name("Interval (ms)");
      autoClickMenu
        .add(propertiesSettings, "autoClickKey", { Left: 6, Right: 7 })
        .name("Target key");
      autoClickMenu.add(propertiesSettings, "deployAutoClicker").name("Deploy");
      autoClickMenu
        .add(propertiesSettings, "clearAutoClicker")
        .name("Clear all");
      autoClickMenu.close();

      //玩家设置
      //@ts-ignore
      playerMenu.add(playerSettings, "refreshPlayerList").name("Refresh");

      playerStore.subscribe((v) => {
        if (!playerMenu) return;
        Object.assign(playerSettings, {});
        playerMenu.getFolders().forEach((f) => f.destroy());

        for (const player of v) {
          const players = playerSettings.players;

          players.push({
            setTargetId: function () {
              targetIdStore.set(player.id);
            },
          });

          const singlePlayerFolder = playerMenu.addFolder(player.name);

          singlePlayerFolder
            .add(playerSettings.players[players.length - 1], "setTargetId")
            .name("Set as camera target");

          singlePlayerFolder.close();
        }
      });

      shortcutMenu
        //@ts-ignore
        .add(shortcut, "openMenu")
        .name("Open Menu")
        .onChange(updateShortcut);

      shortcutMenu
        //@ts-ignore
        .add(shortcut, "jetPack")
        .name("JetPack")
        .onChange(updateShortcut);

      function updateShortcut() {
        GM_setValue("shortcut", shortcut);
        shortcutStore.set(shortcut);
      }
    }
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
</script>

<main>
  <div id="root" class:transparent={doHideMenu}>
    <Menu title="Properties" bind:this={propertiesMenu}></Menu>
    <Menu title="Players" bind:this={playerMenu}></Menu>
    <Menu title="Shortcut" bind:this={shortcutMenu}></Menu>
  </div>
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
