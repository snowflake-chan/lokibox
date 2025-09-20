import { writable, type Writable } from "svelte/store";
import {
  getCore,
  type Core,
  type Player,
  type Body,
  Quaternion,
  type State,
} from "./core";
import { GM_getValue } from "$";

console.log("LokiBox Injected.");

const DEBUG = true;

const isResolved = writable(false);
const jetPackSpeedStore = writable(1.5);
const playerStore: Writable<Player[]> = writable([]);
const targetIdStore: Writable<number | undefined> = writable(undefined);

const shortcut = GM_getValue("shortcut", {
  openMenu: "Tab",
  jetPack: "r",
});

const shortcutStore: Writable<any> = writable(shortcut);

shortcutStore.subscribe((v) => {
  Object.assign(shortcut, v);
});

var jetPackSpeed = 1.5;

jetPackSpeedStore.subscribe((v) => {
  jetPackSpeed = v;
});

var state: State;

getCore().then((v) => {
  console.log("LokiBox Resolved.");

  isResolved.set(true);

  if (DEBUG) {
    (window as unknown as any).core = v;
    console.warn("[WARNING] DEBUGGING");
  }

  const core = v as Core;
  state = core.game.state;
  const playerId = state.secret.id;
  const playerBody = state.bodies.find((v) => v.id == playerId);

  playerStore.set(state.replica.players);

  //喷气背包
  handleKeyBindings(playerBody, core);

  targetIdStore.subscribe((v) => {
    if (v) {
      state.secret.replica.camera.targetId = v;
    } else {
      state.secret.replica.camera.targetId = playerId;
    }
  });
});

export {
  jetPackSpeedStore,
  isResolved,
  playerStore,
  targetIdStore,
  shortcutStore,
};
export function refreshPlayerList() {
  playerStore.set(state.replica.players);
}

var autoClickerHandler: number;
export function deployAutoClicker(interval: number, autoClickKey: number = 6) {
  autoClickerHandler = setInterval(() => {
    state.input.keyState[autoClickKey] = 1;
    setTimeout(() => {
      state.input.keyState[autoClickKey] = 0;
    }, interval / 2);
  }, interval);
}

export function clearAutoClicker() {
  if (!autoClickerHandler) return;
  clearInterval(autoClickerHandler);
  state.input.keyState[6] = 0;
}

function handleKeyBindings(playerBody: Body | undefined, core: Core) {
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === shortcut.jetPack) {
      if (playerBody) {
        const q = Quaternion.parseArray(core.game.state.camera.rotation);
        const forward = new Quaternion(0, 1, 0, 0);
        const { x, y, z } = q.cross(forward).cross(q.inv()).normalize();
        playerBody.vx = z * jetPackSpeed;
        playerBody.vy = -y * jetPackSpeed;
        playerBody.vz = x * jetPackSpeed;
      }
    }
  });
}
