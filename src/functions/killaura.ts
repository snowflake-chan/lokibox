import { coreService } from "src/services/coreService";
import { GM_getValue, GM_setValue } from "$";
import { setCameraTargetId } from "./camera";
import { deployAutoClicker, clearAutoClicker } from "./autoclicker";

let checkInterval: number | null = null;
let targetIndex: number = 0;

export function deployKillAura() {
  try {
    const state = coreService.getStateSync();
    const playerId = state.secret.id;
    
    deployAutoClicker(50, 6);

    checkInterval = window.setInterval(() => {
      try {
        const currentState = coreService.getStateSync();
        const players = currentState.bodies.filter((v) => currentState.playerIndex[v.id]);

        if (players.length > 0) {
          setCameraTargetId(players[targetIndex].id);
          targetIndex = (targetIndex + 1) % players.length;
        } else {
          clearAutoClicker();
          setCameraTargetId(playerId);
          targetIndex = 0;
        }
      } catch (error) {
        console.error("Kill aura tick error:", error);
        clearKillAura();
      }
    }, 500);
  } catch (error) {
    console.error("Deploy kill aura failed - core not initialized:", error);
  }
}

export function clearKillAura() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  clearAutoClicker();
  try {
    const state = coreService.getStateSync();
    const playerId = state.secret.id;
    setCameraTargetId(playerId);
  } catch (error) {
    console.error("Clear kill aura failed:", error);
  }
  
  targetIndex = 0;
}