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

function findPlayersInRange(range: number): Player[] {
  if (!state) return [];

  const players: Player[] = [];
  const playerPos = state.bodies.find(v => v.id === playerId);

  if (!playerPos) return players;

  for (const player of state.replica.players) {
    if (player.id === playerId) continue;

    const targetBody = state.bodies.find(v => v.id === player.id);
    if (!targetBody) continue;

    const dx = playerPos.px - targetBody.px;
    const dy = playerPos.py - targetBody.py;
    const dz = playerPos.pz - targetBody.pz;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance <= range) {
      players.push(player);
    }
  }

  return players;
}

export function deployKillAura() {
  deployAutoClicker(100, 6);

  checkInterval = window.setInterval(() => {
    const players = findPlayersInRange(5);

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