import { getCore } from "../core";
import { GM_getValue, GM_setValue } from "$";
import { setCameraTargetId } from "./camera";
import { deployAutoClicker, clearAutoClicker } from "./autoclicker";

let state: State;
let playerId: number;
let checkInterval: number | null = null;
let targetIndex: number = 0;

getCore().then((core) => {
  state = (core as Core).game.state;
  playerId = state.secret.id;
});


export function deployKillAura() {
  deployAutoClicker(100, 6);

  checkInterval = window.setInterval(() => {
    const players = state.bodies.filter((v) => state.playerIndex[v.id]);

    if (players.length > 0) {
      setCameraTargetId(players[targetIndex].id);
      targetIndex = (targetIndex + 1) % players.length;
    } else {
      clearAutoClicker();
      setCameraTargetId(playerId);
      targetIndex = 0;
    }
  }, 500);
}

export function clearKillAura() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }

  clearAutoClicker();
  setCameraTargetId(playerId);
  targetIndex = 0;
}