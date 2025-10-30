import { GM_getValue, GM_setValue } from "$";
import { switchFunc } from "src/components/functionList";
import { defaultShortcut } from "src/tools/defaults";
import { type Writable, writable } from "svelte/store";

const shortcutStore: Writable<any> = writable(
  GM_getValue("shortcut", defaultShortcut)
);

export { shortcutStore };

//保证更新
if (
  !GM_getValue("shortcut") ||
  GM_getValue("shortcut")["jetPack"] ||
  !GM_getValue("shortcut")["AutoPave"]
) {
  GM_setValue("shortcut", defaultShortcut);
}

export function subscribeShortcut(target: (shortcut: object) => void) {
  shortcutStore.subscribe((v) => {
    target(v);
  });
}

export function getCurrentShortcut(): object {
  return GM_getValue("shortcut", defaultShortcut);
}

/**
 * 激活快捷键
 * @param key 快捷键key
 * @param start 开启功能调用的函数
 * @param end 关闭功能调用的函数
 */
export function activateShortcut(
  key: string,
  start: () => void,
  end: () => void
) {
  let cd = false;
  let isActivated = false;
  window.addEventListener("keydown", (event) => {
    if (event.key == GM_getValue("shortcut")[key] && !cd) {
      if (isActivated) end();
      else start();
      cd = true;
      isActivated = !isActivated;
      setTimeout(() => {
        cd = false;
      }, 200);
    }
  });
}
