import { clearAutoClicker, deployAutoClicker } from "src/functions/autoclicker";
import Menu from "src/components/Menu.svelte";
import {
  clearAimAssist,
  deployAimAssist,
  AimMode,
  setAimMode,
  setAimTarget,
  setAimRange,
  setAimStrength,
  clearBlacklist,
} from "src/functions/aimassist";
import { getPlayerList } from "src/functions/players";
import { deployKillAura, clearKillAura } from "src/functions/killaura";
import { bedFucker } from "src/functions/bedfucker";

const autoClickSettings = {
  interval: 200,
  key: 6,
  deploy: function () {
    clearAutoClicker();
    deployAutoClicker(this.interval, this.key);
  },
  clear: clearAutoClicker,
};
const miscSettings = {
  bedFucker,
};

const aimAssistSettings = {
  mode: AimMode.TARGET,
  target: 0,
  range: 5,
  strength: 0.1,
  deploy: function () {
    setAimMode(this.mode);
    setAimTarget(this.target);
    setAimRange(this.range);
    setAimStrength(this.strength);
    clearAimAssist();
    deployAimAssist();
  },
  clear: clearAimAssist,
  clearBlacklist,
};

export function bind(menu: Menu) {
  const autoClickMenu = menu.addFolder("AutoClicker");

  autoClickMenu
    .add(autoClickSettings, "interval", 50, 2000, 10)
    .name("Interval (ms)");

  autoClickMenu
    .add(autoClickSettings, "key", { Left: 6, Right: 7 })
    .name("Target key");

  autoClickMenu.add(autoClickSettings, "deploy").name("Deploy");
  autoClickMenu.add(autoClickSettings, "clear").name("Clear");

  const aimAssistMenu = menu.addFolder("AimAssist");
  const modeController = aimAssistMenu
    .add(aimAssistSettings, "mode", {
      "Target Mode": AimMode.TARGET,
      "Range Mode": AimMode.RANGE,
    })
    .name("Mode");

  let targetController: any = null;
  let rangeController: any = null;
  let clearBLController: any = null;

  aimAssistMenu
    .add(aimAssistSettings, "strength", 0.01, 1, 0.01)
    .name("Strength");

  function updateControls() {
    if (targetController) {
      targetController.destroy();
      targetController = null;
    }

    if (rangeController) {
      rangeController.destroy();
      rangeController = null;

      clearBLController.destroy();
      clearBLController = null;
    }

    if (aimAssistSettings.mode === AimMode.TARGET) {
      targetController = aimAssistMenu
        .add(aimAssistSettings, "target", getPlayerList())
        .name("Target");

      targetController.domElement.addEventListener("click", () => {
        targetController.options(getPlayerList());
      });
    } else if (aimAssistSettings.mode === AimMode.RANGE) {
      rangeController = aimAssistMenu
        .add(aimAssistSettings, "range", 1, 20, 1)
        .name("Range");

      clearBLController = aimAssistMenu
        .add(aimAssistSettings, "clearBlacklist")
        .name("Clear Blacklist");
    }
  }

  updateControls();

  modeController.onChange(() => {
    updateControls();
  });

  aimAssistMenu.add(aimAssistSettings, "deploy").name("Deploy");
  aimAssistMenu.add(aimAssistSettings, "clear").name("Clear");

  const killauraFolder = menu.addFolder("InfiniteAura");

  const controls = {
    deploy: deployKillAura,
    clear: clearKillAura,
  };

  killauraFolder.add(controls, "deploy").name("Deploy");
  killauraFolder.add(controls, "clear").name("Clear");

  menu.addFolder("Misc").add(miscSettings, "bedFucker");
}
