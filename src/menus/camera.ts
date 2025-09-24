import Menu from "src/components/Menu.svelte";
import { coreService } from "src/services/coreService";
import {
  setCameraFovY,
  setCameraMode,
  setCameraTargetId,
  getPlayerId,
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

  const controller = menu
    .add(playerSettings, "target", getPlayerList())
    .name("Target")
    .onChange(setCameraTargetId);

  menu.add({
    backToMe: () => {
      const playerId = getPlayerId();
      if (playerId) {
        setCameraTargetId(playerId);
        playerSettings.target = playerId;
      }
    }
  }, 'backToMe').name('Back To Me');

  controller.domElement.addEventListener('click', () => {
    controller.options(getPlayerList());
  });

  coreService.getCore().then((core) => {
    const camera = core.game.state.secret.replica.camera;
    playerSettings.mode = camera.mode;
    playerSettings.fovY = camera.fovY;
    playerSettings.target = camera.targetId;
  });
}