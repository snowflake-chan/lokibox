import { GM_setValue, GM_getValue } from "$";
import Menu from "src/components/Menu.svelte";
import { shortcutStore } from "src/functions/shortcut";
import { defaultShortcut } from "src/tools/defaults";

const shortcut = GM_getValue("shortcut", defaultShortcut);

export function bind(menu: Menu) {
  menu.add(shortcut, "openMenu").name("Open Menu").onChange(updateShortcut);

  menu.add(shortcut, "jetPack").name("JetPack").onChange(updateShortcut);

  function updateShortcut() {
    GM_setValue("shortcut", shortcut);
    shortcutStore.set(shortcut);
  }
}
