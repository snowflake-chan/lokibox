import Menu from "src/components/Menu.svelte";
import {
  setCameraFovY,
  setCameraMode,
  setCameraTargetId,
  getPlayerId,
  getCameraMode,
  getCameraFovY,
  getCameraTargetId,
} from "src/tools/arch";
import { getPlayerMap } from "src/tools/arch";
import {
  enableKillAura,
  disableKillAura,
  isKillAuraEnabled,
  getKillAuraConfig,
  setKillAuraRange
} from "src/functions/killarua";

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
    .add(playerSettings, "target", getPlayerMap())
    .name("Target")
    .onChange(setCameraTargetId);

  menu
    .add(
      {
        backToMe: () => {
          const playerId = getPlayerId();
          if (playerId) {
            setCameraTargetId(playerId);
            playerSettings.target = playerId;
          }
        },
      },
      "backToMe"
    )
    .name("Back To Me");

  const killAuraConfig = getKillAuraConfig();
  const killAuraState = {
    enabled: killAuraConfig.enabled,
    range: killAuraConfig.range
  };

  const killAuraFolder = menu.addFolder("Kill Aura");

  killAuraFolder.add(killAuraState, "enabled")
    .name("Enabled")
    .onChange((value: boolean) => {
      value ? enableKillAura() : disableKillAura();
      killAuraState.enabled = isKillAuraEnabled();
    });

  killAuraFolder.add(killAuraState, "range", 1, 50, 1)
    .name("Range")
    .onChange((value: number) => {
      setKillAuraRange(value);
    });

  controller.domElement.addEventListener("click", () => {
    controller.options(getPlayerMap());
  });
  playerSettings.mode = getCameraMode();
  playerSettings.fovY = getCameraFovY();
  playerSettings.target = getCameraTargetId();
}
