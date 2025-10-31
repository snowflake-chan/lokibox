/**
 * 喷气背包
 * @module functions/jetpack
 */
import { GM_getValue } from "$";
import { defaultJetPackSpeed, defaultShortcut } from "src/tools/defaults";
import { Quaternion } from "src/tools/quaternion";
import { subscribeShortcut } from "./shortcut";
import { getCameraRotation, getSelfBody } from "src/tools/arch";
import { switchOn, switchOff } from "src/functions/funcStatus";

const shortcut = { ...defaultShortcut };

subscribeShortcut((t) => {
  Object.assign(shortcut, t);
});

let jetPackSpeed = GM_getValue("jetPackSpeed", defaultJetPackSpeed);

async function handleJetpackKey() {
  try {
    const playerBody = getSelfBody!();
    const q = getCameraRotation();
    const forward = new Quaternion(0, 1, 0, 0);
    const { x, y, z } = q.cross(forward).cross(q.inv()).normalize();
    playerBody.vx = z * jetPackSpeed;
    playerBody.vy = -y * jetPackSpeed + 0.05;
    playerBody.vz = x * jetPackSpeed;
  } catch (e) {
    console.error(e);
  }
}

function onKeydown(e: KeyboardEvent) {
  //挂载快捷键
  if (e.key === shortcut["JetPack"]) {
    void handleJetpackKey();
    switchOn("JetPack");
  }
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === shortcut["JetPack"]) {
    switchOff("JetPack");
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("keyup", onKeyUp);
}

/**设置喷气背包速度 */
export function setJetPackSpeed(speed: number) {
  jetPackSpeed = speed;
}
