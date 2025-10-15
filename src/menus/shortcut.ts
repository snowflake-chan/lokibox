import { GM_setValue, GM_getValue } from "$";
import Menu from "src/components/Menu.svelte";
import { shortcutStore } from "src/functions/shortcut";
import { defaultShortcut } from "src/tools/defaults";

const shortcut = GM_getValue("shortcut", defaultShortcut);

export function bind(menu: Menu) {
  for (const i in shortcut) {
    //@ts-ignore
    menu.add(shortcut, i).onChange(updateShortcut);
  }

  function updateShortcut() {
    GM_setValue("shortcut", shortcut);
    shortcutStore.set(shortcut);
  }

  function resetShortcut() {
    GM_setValue("shortcut", defaultShortcut);
    shortcutStore.set(defaultShortcut);
  }
}
