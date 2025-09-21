import { writable, type Writable } from "svelte/store";
import { getCore } from "../core";

console.log("LokiBox Injected.");

const DEBUG = true;

var state: State;

getCore().then((v) => {
  console.log("LokiBox Resolved.");

  if (DEBUG) {
    (window as unknown as any).core = v;
    console.warn("[WARNING] DEBUGGING");
  }

  const core = v as Core;
  state = core.game.state;
});

export function getPlayerList(): Record<string, number> {
  if (state) {
    const playerList: Record<string, number> = {};
    for (const i of state.replica.players) {
      playerList[i.name] = i.id;
    }
    return playerList;
  } else {
    return {};
  }
}
