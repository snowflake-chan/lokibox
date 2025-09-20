import { mount } from "svelte";
//@ts-ignore
import App from "./App.svelte";
import "../node_modules/lil-gui/dist/lil-gui.css";

const app = mount(App, {
  target: (() => {
    const app = document.createElement("div");
    document.body.append(app);
    return app;
  })(),
});

export default app;
