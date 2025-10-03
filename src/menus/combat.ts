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
} from "src/functions/aimassist";
import { getPlayerMap } from "src/tools/arch";
import { bedFucker } from "src/functions/bedfucker";
import { clearTeammates } from "src/functions/teammates";

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
  clearTeammates,
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
        .add(aimAssistSettings, "target", getPlayerMap())
        .name("Target");

      targetController.domElement.addEventListener("click", () => {
        targetController.options(getPlayerMap());
      });
    } else if (aimAssistSettings.mode === AimMode.RANGE) {
      rangeController = aimAssistMenu
        .add(aimAssistSettings, "range", 1, 20, 1)
        .name("Range");

      clearBLController = aimAssistMenu
        .add(aimAssistSettings, "clearTeammates")
        .name("Clear Teammates");
    }
  }

  updateControls();

  modeController.onChange(() => {
    updateControls();
  });

  aimAssistMenu.add(aimAssistSettings, "deploy").name("Deploy");
  aimAssistMenu.add(aimAssistSettings, "clear").name("Clear");

  menu.addFolder("Misc").add(miscSettings, "bedFucker").name("BedFucker");
}
