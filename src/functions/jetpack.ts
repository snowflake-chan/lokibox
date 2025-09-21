import { GM_getValue } from "$";
import { getCore } from "src/core";
import { defaultJetPackSpeed, defaultShortcut } from "src/tools/defaults";
import { Quaternion } from "src/tools/quaternion";
import { writable } from "svelte/store";
import { subscribeShortcut } from "./shortcut";

const shortcut: Shortcut = defaultShortcut;

subscribeShortcut((t)=>{
  Object.assign(shortcut, t);
});

var jetPackSpeed = GM_getValue("jetPackSpeed", defaultJetPackSpeed);

const jetPackSpeedStore = writable(jetPackSpeed);

jetPackSpeedStore.subscribe((v) => {
  jetPackSpeed = v;
});

var state: State;
var playerId: number;
var playerBody: Body | undefined;

getCore().then((core) => {
  state = (core as Core).game.state;
  playerId = state.secret.id;
  playerBody = state.bodies.find((v) => v.id == playerId);
});

window.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === shortcut.jetPack) {
    if (playerBody && state) {
      const q = Quaternion.parseArray(state.camera.rotation);
      const forward = new Quaternion(0, 1, 0, 0);
      const { x, y, z } = q.cross(forward).cross(q.inv()).normalize();
      playerBody.vx = z * jetPackSpeed;
      playerBody.vy = -y * jetPackSpeed;
      playerBody.vz = x * jetPackSpeed;
    }
  }
});

export { jetPackSpeedStore };
