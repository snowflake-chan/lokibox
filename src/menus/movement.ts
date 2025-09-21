import { GM_getValue, GM_setValue } from "$";
import { jetPackSpeedStore } from "src/functions/jetpack";
import Menu from "src/components/Menu.svelte";
import { defaultJetPackSpeed } from "src/tools/defaults";

const propertiesSettings = {
  jetPackSpeed: GM_getValue("jetPackSpeed", defaultJetPackSpeed),
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
}
