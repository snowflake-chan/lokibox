import { coreService } from "src/services/coreService";

const DEBUG = true;

if (DEBUG) {
  coreService.onReady((core) => {
    try {
      (window as unknown as any).core = core;
      console.warn("[WARNING] DEBUGGING: core exposed on window");
    } catch (e) {
      console.log(e);
    }
  });
}

export function getPlayerList(): Record<string, number> {
  const state = coreService.getStateSync();
  const playerList: Record<string, number> = {};
  for (const p of state.replica.players) {
    playerList[p.name] = p.id;
  }
  return playerList;
}
