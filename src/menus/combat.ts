import { clearAutoClicker, deployAutoClicker } from "src/functions/autoclicker";
import Menu from "src/components/Menu.svelte";

const autoClickSettings = {
  autoClickInterval: 200,
  autoClickKey: 6,
  deployAutoClicker: function () {
    clearAutoClicker();
    deployAutoClicker(this.autoClickInterval, this.autoClickKey);
  },
  clearAutoClicker,
};

export function bind(menu: Menu) {
  const autoClickMenu = menu.addFolder("AutoClicker");

  autoClickMenu
    .add(autoClickSettings, "autoClickInterval", 50, 2000, 10)
    .name("Interval (ms)");

  autoClickMenu
    .add(autoClickSettings, "autoClickKey", { Left: 6, Right: 7 })
    .name("Target key");

  autoClickMenu.add(autoClickSettings, "deployAutoClicker").name("Deploy");
  autoClickMenu.add(autoClickSettings, "clearAutoClicker").name("Clear all");
}
