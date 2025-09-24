import { coreService } from "src/services/coreService";

let autoClickerHandler: number | null = null;

export function deployAutoClicker(interval: number, autoClickKey: number = 6) {
  clearAutoClicker();
  autoClickerHandler = setInterval(() => {
    try {
      const state = coreService.getStateSync();
      state.input.keyState[autoClickKey] = 1;
      
      setTimeout(() => {
        try {
          const currentState = coreService.getStateSync();
          currentState.input.keyState[autoClickKey] = 0;
        } catch (error) {
          console.error("Auto clicker reset failed:", error);
        }
      }, interval / 2);
    } catch (error) {
      console.error("Auto clicker tick failed - core not initialized:", error);
      clearAutoClicker();
    }
  }, interval);
}

export function clearAutoClicker() {
  if (autoClickerHandler) {
    clearInterval(autoClickerHandler);
    autoClickerHandler = null;
    try {
      const state = coreService.getStateSync();
      state.input.keyState[6] = 0;
    } catch (error) {
      console.error("Clear auto clicker failed:", error);
    }
  }
}