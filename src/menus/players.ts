import Menu from "src/components/Menu.svelte";
import { targetIdStore } from "src/functions/camera";
import { getPlayerList } from "src/functions/players";

const playerSettings = {
  target: 0,
  setTargetId: function () {
    targetIdStore.set(this.target);
  },
};

export function bind(menu: Menu) {
  //玩家设置
  menu.add(playerSettings, "target", getPlayerList()).name("Target");

  menu.add(playerSettings, "setTargetId").name("Set as target ID");
}
