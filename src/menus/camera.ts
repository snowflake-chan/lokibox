import Menu from "src/components/Menu.svelte";
import { getCore } from "src/core";
import {
  setCameraFovY,
  setCameraMode,
  setCameraTargetId,
} from "src/functions/camera";
import { getPlayerList } from "src/functions/players";

const playerSettings = {
  mode: 0,
  fovY: 0.25,
  target: 0,
};

export function bind(menu: Menu) {
  menu
    .add(playerSettings, "mode", { Follow: 0, Fixed: 1, FPS: 2 })
    .name("Mode")
    .onChange(setCameraMode);
  menu
    .add(playerSettings, "fovY", 0, 1, 0.01)
    .name("FovY")
    .onChange(setCameraFovY);
  //玩家设置
  const controller = menu
    .add(playerSettings, "target", getPlayerList())
    .name("Target")
    .onChange(setCameraTargetId);

  controller.domElement.addEventListener('click',()=>{
    controller.options(getPlayerList());
  });
}

getCore().then((core) => {
  const camera = (core as Core).game.state.secret.replica.camera;
  playerSettings.mode = camera.mode;
  playerSettings.fovY = camera.fovY;
  playerSettings.target = camera.targetId;
});
