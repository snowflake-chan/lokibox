/**
 * 自动搭路模块
 * @module functions/autopave
 */
import {
  applyAxisMovement,
  getCamera,
  getCameraRotation,
  getSelfBody,
  isTarget,
} from "src/tools/arch";
import { worldToScreen } from "src/tools/world2screen";
import { activateShortcut } from "./shortcut";

let handler: number | null = null;

enum Direction {
  POSITIVE_X = 0,
  POSITIVE_Z,
  NEGATIVE_X,
  NEGATIVE_Z,
}

//Z+=-3, Z-=0, X- -1 X+ 1

/**正方向 */
let direction: Direction;
let x: number;
let y: number;
let z: number;

/**部署AimAssist */
export function deployAutoPave() {
  clearAutoPave();
  const yaw = getCameraRotation().getYaw();
  const p = Math.PI;

  const self = getSelfBody();
  x = Math.round(self.px + 0.5) - 0.5;
  y = Math.ceil(self.py - 1);
  z = Math.round(self.pz + 0.5) - 0.5;

  if (-p / 4 < yaw && yaw <= p / 4) {
    direction = Direction.NEGATIVE_Z;
    z -= 0.4;
  } else if (p / 4 < yaw && yaw <= (p * 3) / 4) {
    direction = Direction.POSITIVE_X;
    x += 0.4;
  } else if (-p / 4 >= yaw && yaw > -(p * 3) / 4) {
    direction = Direction.NEGATIVE_X;
    x -= 0.4;
  } else {
    direction = Direction.POSITIVE_Z;
    z += 0.4;
  }

  handler = setInterval(() => {
    const camera = getCamera();

    if (self) {
      const selfPos = [self.px, self.py, self.pz];
      const targetPos = [x, y, z];

      if (!isTarget(selfPos, targetPos, camera, 90)) return;
    }
    const screenPos = worldToScreen(x, y, z);

    if (screenPos) {
      const viewport = camera.viewport;
      const dx = screenPos.x - viewport[0] / 2;
      const dy = screenPos.y - viewport[1] / 2;
      applyAxisMovement(dx * 0.1, dy * 0.1);
    }
  }, 10);

  window.addEventListener("mousedown", (event) => {
    if (event.button === 2) {
      switch (direction) {
        case Direction.POSITIVE_X:
          x += 0.3;
          break;
        case Direction.NEGATIVE_X:
          x -= 0.3;
          break;
        case Direction.POSITIVE_Z:
          z += 0.3;
          break;
        case Direction.NEGATIVE_Z:
          z -= 0.3;
          break;
      }
      console.log(x, y, z);
    }
  });
}

/**清除AimAssist */
export function clearAutoPave() {
  if (handler) {
    clearInterval(handler);
    handler = null;
  }
}

activateShortcut("AutoPave", deployAutoPave, clearAutoPave);
