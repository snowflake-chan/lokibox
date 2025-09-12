import { mount } from "svelte";
import "./app.css";
//@ts-ignore
import App from "./App.svelte";
import { getCore } from "./core";
import type { Core } from "./core";

const DEBUG = true;

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
