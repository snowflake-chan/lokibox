import { getCore } from "src/core";
import { type Writable, writable } from "svelte/store";

const targetIdStore: Writable<number | undefined> = writable(undefined);

getCore().then((core) => {
  const state = (core as Core).game.state;
  const playerId = state.secret.id;
  targetIdStore.subscribe((v) => {
    if (v) {
      state.secret.replica.camera.targetId = v;
    } else {
      state.secret.replica.camera.targetId = playerId;
    }
  });
});

export {targetIdStore};