import { GM_getValue } from "$";
import { coreService } from "src/services/coreService";
import { defaultJetPackSpeed, defaultShortcut } from "src/tools/defaults";
import { Quaternion } from "src/tools/quaternion";
import { writable } from "svelte/store";
import { subscribeShortcut } from "./shortcut";

const shortcut: Shortcut = { ...defaultShortcut };

subscribeShortcut((t) => {
  Object.assign(shortcut, t);
});

let jetPackSpeed = typeof GM_getValue === "function" ? GM_getValue("jetPackSpeed", defaultJetPackSpeed) : defaultJetPackSpeed;

const jetPackSpeedStore = writable(jetPackSpeed);
jetPackSpeedStore.subscribe((v) => (jetPackSpeed = v));

async function handleJetpackKey() {
  try {
    const state = await coreService.getState();
    const playerId = state.secret.id;
    const playerBody = state.bodies.find((v) => v.id == playerId);
    if (!playerBody) return;
    const q = Quaternion.parseArray(state.camera.rotation);
    const forward = new Quaternion(0, 1, 0, 0);
    const { x, y, z } = q.cross(forward).cross(q.inv()).normalize();
    playerBody.vx = z * jetPackSpeed;
    playerBody.vy = -y * jetPackSpeed;
    playerBody.vz = x * jetPackSpeed;
  } catch (e) {
    console.error(e);
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === shortcut.jetPack) {
    void handleJetpackKey();
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("keydown", onKeydown);
  coreService.registerCleanup(() => window.removeEventListener("keydown", onKeydown));
}

export { jetPackSpeedStore };
