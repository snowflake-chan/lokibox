import { getCore } from "src/core";

var state:State;

getCore().then((core) => {
  state = (core as Core).game.state;
});

export function setCameraTargetId(id:number){
  state.secret.replica.camera.targetId = id;
}

export function setCameraMode(mode:number){
  state.secret.replica.camera.mode = mode;
}

export function setCameraFovY(fovY:number){
  state.secret.replica.camera.fovY = fovY;
}