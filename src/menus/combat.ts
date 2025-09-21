import { clearAutoClicker, deployAutoClicker } from "src/functions/autoclicker";
import Menu from "src/components/Menu.svelte";
import { clearAimAssist, deployAimAssist } from "src/functions/aimassist";
import { getPlayerList } from "src/functions/players";

const autoClickSettings = {
  interval: 200,
  key: 6,
  deploy: function () {
    clearAutoClicker();
    deployAutoClicker(this.interval, this.key);
  },
  clear: clearAutoClicker,
};

const aimAssistSettings = {
  target: 0,
  deploy: function () {
    clearAimAssist();
    deployAimAssist(this.target, 0.1);
  },
  clear: clearAimAssist,
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

  const controller = aimAssistMenu
    .add(aimAssistSettings, "target", getPlayerList())
    .name("Target");

  controller.domElement.addEventListener("click", () => {
    controller.options(getPlayerList());
  });

  aimAssistMenu.add(aimAssistSettings, "deploy").name("Deploy");
  aimAssistMenu.add(aimAssistSettings, "clear").name("Clear");
}
