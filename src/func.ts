import { writable, type Writable } from "svelte/store";
import {
  getCore,
  type Core,
  type Player,
  type Body,
  Quaternion,
  type State,
} from "./core";

console.log("LokiBox Injected.");

const DEBUG = true;

const isResolved = writable(false);
const jetPackSpeedStore = writable(1.5);
const playerStore: Writable<Player[]> = writable([]);
const targetIdStore: Writable<number | undefined> = writable(undefined);

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

export { jetPackSpeedStore, isResolved, playerStore, targetIdStore };
export function refreshPlayerList() {
  playerStore.set(state.replica.players);
}

var autoClickerHandler: number;
export function deployAutoClicker(interval: number) {
  autoClickerHandler = setInterval(() => {
    state.input.keyState[6] = 1;
    setTimeout(() => {
      state.input.keyState[6] = 0;
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
    if (e.key === "r") {
      if (playerBody) {
        const q = Quaternion.parseArray(core.game.state.camera.rotation);
        const forward = new Quaternion(0, 1, 0, 0);
        const { x, y, z } = q.cross(forward).cross(q.inv()).normalize();
        playerBody.vx = z * jetPackSpeed;
        playerBody.vy = -y * jetPackSpeed;
        playerBody.vz = x * jetPackSpeed;
      }
    }
    // if (e.key === "l") {
    //   console.log("LLL");
    //   (core.game as any).input.onKeyDown.notify(6);
    // }
    if (e.key === "l") {
      const e = new MouseEvent("mousedown", {
        bubbles: true, // 是否冒泡 —— 一般 true
        cancelable: true, // 是否可取消(可preventDefault) —— 一般 true
        view: window, // 事件视图，通常 window
        detail: 1, // 点击次数（单击=1，双击=2）
        screenX: 100, // 屏幕坐标（可选）
        screenY: 200,
        clientX: 100, // 视口坐标（必填/常用）
        clientY: 200,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        button: 0, // 按钮：0 = 左键, 1 = 中键, 2 = 右键
        buttons: 1, // 按钮掩码，左键通常是 1
        relatedTarget: null,
        // movementX/Y 不能通过构造器设置（只读），不需要提供
      });
      document.querySelector("canvas")?.dispatchEvent(e);
    }
  });
}
