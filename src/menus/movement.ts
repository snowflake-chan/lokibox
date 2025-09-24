import { GM_getValue, GM_setValue } from "$";
import { setJetPackSpeed } from "src/functions/jetpack";
import Menu from "src/components/Menu.svelte";
import { defaultJetPackSpeed } from "src/tools/defaults";
import { teleport } from "src/functions/teleport";
import { getVoxelShape } from "src/tools/arch";

const movementSettings = {
  jetPackSpeed: GM_getValue("jetPackSpeed", defaultJetPackSpeed),
  autoPave: function () {},
  targetX: 0,
  targetY: 0,
  targetZ: 0,
  teleport: function () {
    teleport(this.targetX, this.targetY, this.targetZ);
  },
};

export function bind(menu: Menu) {
  const shape = getVoxelShape();
  movementSettings["targetX"] = shape.x / 2;
  movementSettings["targetY"] = shape.y / 2;
  movementSettings["targetZ"] = shape.z / 2;
  //参数设置
  //喷气背包
  menu
    .add(movementSettings, "jetPackSpeed", 0.5, 10, 0.5)
    .name("JetPack.Speed")
    .onChange((v: number) => {
      GM_setValue("jetPackSpeed", v);
      setJetPackSpeed
    });

  const teleportFolder = menu.addFolder("Teleport");
  teleportFolder.add(movementSettings, "targetX", 0, shape.x, 0.5).name("X");
  teleportFolder.add(movementSettings, "targetY", 0, shape.y, 0.5).name("Y");
  teleportFolder.add(movementSettings, "targetZ", 0, shape.z, 0.5).name("Z");
  teleportFolder.add(movementSettings, "teleport").name("Teleport");
}
