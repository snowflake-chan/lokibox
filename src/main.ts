import { mount } from "svelte";
import "./app.css";
//@ts-ignore
import App from "./App.svelte";
import { getCore, Quaternion } from "./core";
import type { Core } from "./core";

const DEBUG = true;
var velocity = 3;

getCore().then((v) => {
  if (DEBUG) {
    (window as unknown as any).core = v;
  }
  const core = v as Core;
  const uuid = core.game.state.secret.id;
  const playerBody = core.game.state.bodies.find((v) => v.id == uuid);
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key == "r") {
      if (playerBody) {
        const q = Quaternion.parseArray(core.game.state.camera.rotation);
        const forward = new Quaternion(0, 1, 0, 0);
        const { x, y, z } = q.mul(forward).mul(q.inv()).normalize();
        playerBody.vx = z * velocity;
        playerBody.vy = -y * velocity;
        playerBody.vz = x * velocity;
      }
    }
  });
});

const app = mount(App, {
  target: (() => {
    const app = document.createElement("div");
    document.body.append(app);
    return app;
  })(),
});

export default app;
