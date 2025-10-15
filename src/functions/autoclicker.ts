/**
 * 连点器模块
 * @module functions/autoclicker
 */
import { setKeyState } from "src/tools/arch";
import { activateShortcut } from "./shortcut";

let autoClickerHandler: number | null = null;

export function deployAutoClicker(interval: number, autoClickKey: number = 6) {
  clearAutoClicker();
  autoClickerHandler = setInterval(() => {
    setKeyState(autoClickKey, 1);
    setTimeout(() => {
      setKeyState(autoClickKey, 0);
    }, interval / 2);
  }, interval);
}

export function clearAutoClicker() {
  if (autoClickerHandler) {
    clearInterval(autoClickerHandler);
    autoClickerHandler = null;
    setKeyState(6, 0);
    setKeyState(7, 0);
  }
}

activateShortcut(
  "AutoClicker",
  () => {
    deployAutoClicker(50);
  },
  clearAutoClicker
);
