import { GM_getValue } from "$";
import { defaultJetPackSpeed, defaultShortcut } from "src/tools/defaults";
import { Quaternion } from "src/tools/quaternion";
import { subscribeShortcut } from "./shortcut";
import { getCameraRotation, getSelfBody } from "src/tools/arch";

const shortcut: Shortcut = { ...defaultShortcut };

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
    playerBody.vy = -y * jetPackSpeed;
    playerBody.vz = x * jetPackSpeed;
  } catch (e) {
    console.error(e);
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === shortcut.jetPack) {
    void handleJetpackKey();
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("keydown", onKeydown);
}

export function setJetPackSpeed(speed: number) {
  jetPackSpeed = speed;
}
