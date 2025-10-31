import { GM_getValue, GM_setValue } from "$";
import { setJetPackSpeed } from "src/functions/jetpack";
import Menu from "src/components/Menu.svelte";
import { defaultJetPackSpeed } from "src/tools/defaults";
import { teleport } from "src/functions/teleport";
import { getVoxelShape } from "src/tools/arch";
import {
  enableGhost,
  disableGhost,
  getGhostConfig,
  setGhostRange
} from "src/functions/ghost";

const movementSettings = {
  jetPackSpeed: GM_getValue("jetPackSpeed", defaultJetPackSpeed),
  autoPave: function () { },
  targetX: 0,
  targetY: 0,
  targetZ: 0,

  teleport: function () {
    teleport(this.targetX, this.targetY, this.targetZ);
  }
};

export function bind(menu: Menu) {
  const shape = getVoxelShape();

  movementSettings["targetX"] = shape.x / 2;
  movementSettings["targetY"] = shape.y / 2;
  movementSettings["targetZ"] = shape.z / 2;
  //参数设置
  //喷气背包
  menu
    .add(movementSettings, "jetPackSpeed", 0.5, 10, 0.1)
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

  const ghostConfig = getGhostConfig();
  const ghostState = {
    enabled: ghostConfig.enabled,
    offset1: { ...ghostConfig.offset1 },
    offset2: { ...ghostConfig.offset2 }
  };

  const ghostFolder = menu.addFolder("Ghost");

  ghostFolder.add(ghostState, "enabled")
    .name("Enabled")
    .onChange((value: boolean) => {
      value ? enableGhost() : disableGhost();
    });

  const updateRange = () => setGhostRange(ghostState.offset1, ghostState.offset2);

  const minFolder = ghostFolder.addFolder("Min Offset");
  minFolder.add(ghostState.offset1, "x", -10, 10, 1).name("X").onChange(updateRange);
  minFolder.add(ghostState.offset1, "y", -10, 10, 1).name("Y").onChange(updateRange);
  minFolder.add(ghostState.offset1, "z", -10, 10, 1).name("Z").onChange(updateRange);

  const maxFolder = ghostFolder.addFolder("Max Offset");
  maxFolder.add(ghostState.offset2, "x", -10, 10, 1).name("X").onChange(updateRange);
  maxFolder.add(ghostState.offset2, "y", -10, 10, 1).name("Y").onChange(updateRange);
  maxFolder.add(ghostState.offset2, "z", -10, 10, 1).name("Z").onChange(updateRange);
}
