import { GM_getValue, GM_setValue } from "$";
import { deployAutoClicker, clearAutoClicker } from "src/functions/autoclicker";
import { jetPackSpeedStore } from "src/functions/jetpack";
import Menu from "src/components/Menu.svelte";

type PropertiesSettings = {
  jetPackSpeed: number;
  autoClickInterval: number;
  autoClickKey: number;
  deployAutoClicker: () => void;
  clearAutoClicker: () => void;
};
const propertiesSettings: PropertiesSettings = {
  jetPackSpeed: GM_getValue("jetPackSpeed", 1.5),
  autoClickInterval: 200,
  autoClickKey: 6,
  deployAutoClicker: function () {
    clearAutoClicker();
    deployAutoClicker(this.autoClickInterval, this.autoClickKey);
  },
  clearAutoClicker,
};

export function bind(menu: Menu) {
  //参数设置
  //喷气背包
  menu
    .add(propertiesSettings, "jetPackSpeed", 0.5, 10, 0.5)
    .name("JetPack.Speed")
    .onChange((v: number) => {
      GM_setValue("jetPackSpeed", v);
      jetPackSpeedStore.set(v);
    });

  const autoClickMenu = menu.addFolder("AutoClicker");

  autoClickMenu
    .add(propertiesSettings, "autoClickInterval", 50, 2000, 10)
    .name("Interval (ms)");

  autoClickMenu
    .add(propertiesSettings, "autoClickKey", { Left: 6, Right: 7 })
    .name("Target key");

  autoClickMenu.add(propertiesSettings, "deployAutoClicker").name("Deploy");
  autoClickMenu.add(propertiesSettings, "clearAutoClicker").name("Clear all");
  autoClickMenu.close();
}
