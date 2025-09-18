import { writable } from "svelte/store";
import { getCore, type Core, Quaternion } from "./core";

console.log("LokiBox Injected.");

const DEBUG = true;

const isResolved = writable(false);
const jetPackSpeedStore = writable(1.5);
const functionStore = writable([]);

var jetPackSpeed = 1.5;

jetPackSpeedStore.subscribe((v)=>{jetPackSpeed=v});

var autoAim = false;
var autoAimTarget: number | undefined;

getCore().then((v) => {

  console.log("LokiBox Resolved.");

  isResolved.set(true);

  if (DEBUG) {
    (window as unknown as any).core = v;
    console.warn("[WARNING] DEBUGGING");
  }

  const core = v as Core;
  const playerId = core.game.state.secret.id;
  const playerBody = core.game.state.bodies.find((v) => v.id == playerId);
  const selfIndex = core.game.state.bodies.findIndex((v) => v.id == playerId);

  //喷气背包
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
    if (e.key === "l") {
      autoAim = true;
      autoAimTarget = Number(prompt("目标？"));
    }
    if (e.key === "k" && playerBody) {
      playerBody.px = 64;
      playerBody.pz = 8;
      playerBody.py = 6;
    }
    if (e.key === "j" && playerBody) {
      playerBody.px = 64;
      playerBody.pz = 120;
      playerBody.py = 6;
    }
  });

  //自动瞄准
  if (playerBody && autoAim) {
    const selfProxy = new Proxy(playerBody, {
      set(target, property, value) {
        if (autoAimTarget) {
          core.game.state.secret.replica.camera.mode = 1;
          if (property === "px" || property === "py" || property === "pz") {
            const t = core.game.state.bodies.find(
              (v) => v.id === autoAimTarget
            );
            if (t) {
              core.game.state.secret.replica.camera.eye[0] = target.px;
              core.game.state.secret.replica.camera.eye[1] = target.py + 2;
              core.game.state.secret.replica.camera.eye[2] = target.pz;
              core.game.state.secret.replica.camera.target[0] = t.px;
              core.game.state.secret.replica.camera.target[1] = t.py;
              core.game.state.secret.replica.camera.target[2] = t.pz;
            }
          }
          (target as any)[property] = value;
        }
        return true;
      },
    });
    core.game.state.bodies[selfIndex] = selfProxy;
  }
  // (core.game as any).input._handleMouseDown({
  //   isTrusted: true,
  //   altKey: false,
  //   bubbles: true,
  //   button: 0,
  //   buttons: 1,
  //   cancelBubble: false,
  //   cancelable: true,
  //   clientX: 499,
  //   clientY: 375,
  //   composed: true,
  //   ctrlKey: false,
  //   currentTarget: document,
  //   defaultPrevented: false,
  // });
});

export {jetPackSpeedStore, isResolved};