import { GM_getValue } from "$";
import { defaultShortcut } from "src/tools/defaults";
import { type Writable, writable } from "svelte/store";

const shortcutStore: Writable<any> = writable(GM_getValue("shortcut", defaultShortcut));

export { shortcutStore };

export function subscribeShortcut(target: (shortcut: Shortcut) => void) {
  shortcutStore.subscribe((v) => {
    target(v);
  });
}

export function getCurrentShortcut(): Shortcut{
  return GM_getValue("shortcut", defaultShortcut);
}
