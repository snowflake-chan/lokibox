import { mount } from "svelte";
//@ts-ignore
import App from "./App.svelte";
import { getCore, Quaternion, Vector3 } from "./core";
import type { Core } from "./core";

console.log("LokiBox Injected.")

const DEBUG = true;
var velocity = 1.5;

getCore().then((v) => {
  console.log("LokiBox Resolved.");
  if (DEBUG) {
    (window as unknown as any).core = v;
    console.warn("[WARNING] DEBUGGING");
  }

  const core = v as Core;
  const playerId = core.game.state.secret.id;
  const playerBody = core.game.state.bodies.find((v) => v.id == playerId);

  //喷气背包
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "r") {
      if (playerBody) {
        const q = Quaternion.parseArray(core.game.state.camera.rotation);
        const forward = new Quaternion(0, 1, 0, 0);
        const { x, y, z } = q.cross(forward).cross(q.inv()).normalize();
        playerBody.vx = z * velocity;
        playerBody.vy = -y * velocity;
        playerBody.vz = x * velocity;
      }
    }
  });

  //自动瞄准
  setInterval(() => {
    // if (playerBody) {
    //   const playerIndex = Object.keys(core.game.state.playerIndex);
    //   const aimTargets = core.game.state.bodies.filter(
    //     (v) => v.id in playerIndex && v.id !== playerId
    //   );
    //   if (aimTargets.length == 0) return;
    //   const vecDistMap = aimTargets.map(
    //     (v) =>
    //       new Vector3(
    //         v.px - playerBody.px,
    //         v.py - playerBody.py,
    //         v.pz - playerBody.pz
    //       )
    //   );
    //   const distanceMap = vecDistMap.map((v) => v.sqrMag());
    //   const minIndex = distanceMap.reduce((minIndex, current, currentIndex) => {
    //     return current < distanceMap[minIndex] ? currentIndex : minIndex;
    //   }, 0);

    //   const direction = vecDistMap[minIndex];
    //   const forwardDirection = new Vector3(1, 0, 0);

    //   const cos = direction.cos(forwardDirection);
    //   const halfSin = Math.sqrt((1 - cos) / 2);
    //   const halfCos = Math.sqrt((1 + cos) / 2);
    //   const { x, y, z } = direction.scale(halfSin);

    //   const q = new Quaternion(halfCos, x, y, z);
    //   for (let i = 0; i < 4; i++)
    //     core.game.state.camera.rotation[i] = Object.values(q)[i];
    // }
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
  }, 100);
});

const app = mount(App, {
  target: (() => {
    const app = document.createElement("div");
    document.body.append(app);
    return app;
  })(),
});

export default app;
