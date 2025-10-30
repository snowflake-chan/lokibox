/**
 * Combat菜单
 * @module menus/combat
 */
import { clearAutoClicker, deployAutoClicker } from "src/functions/autoclicker";
import Menu from "src/components/Menu.svelte";
import {
  clearAimAssist,
  deployAimAssist,
  setAimRange,
  setAimStrength,
} from "src/functions/aimassist";
import { bedFucker } from "src/functions/bedfucker";
import { clearTeammates } from "src/functions/teammates";
import "src/functions/autopave";

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
  range: 5,
  strength: 0.1,
  deploy: function () {
    setAimRange(this.range);
    setAimStrength(this.strength);
    clearAimAssist();
    deployAimAssist();
  },
  clear: clearAimAssist,
  clearTeammates,
};

export function bind(menu: Menu) {
  //AutoClicker
  const autoClickMenu = menu.addFolder("AutoClicker");

  autoClickMenu
    .add(autoClickSettings, "interval", 50, 2000, 10)
    .name("Interval (ms)");

  autoClickMenu
    .add(autoClickSettings, "key", { Left: 6, Right: 7 })
    .name("Target key");

  autoClickMenu.add(autoClickSettings, "deploy").name("Deploy");
  autoClickMenu.add(autoClickSettings, "clear").name("Clear");

  //AimAssist

  const aimAssistMenu = menu.addFolder("AimAssist");

  aimAssistMenu
    .add(aimAssistSettings, "strength", 0.01, 1, 0.01)
    .name("Strength");

  aimAssistMenu.add(aimAssistSettings, "range", 1, 20, 1).name("Range");

  aimAssistMenu
    .add(aimAssistSettings, "clearTeammates")
    .name("Clear Teammates");

  aimAssistMenu.add(aimAssistSettings, "deploy").name("Deploy");
  aimAssistMenu.add(aimAssistSettings, "clear").name("Clear");

  menu.addFolder("Misc").add(miscSettings, "bedFucker").name("BedFucker");
}
