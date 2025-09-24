import { getCameraMode, setCameraEye, setCameraMode, setCameraTarget } from "src/tools/arch";

const y = 41.5;
const x1 = 192.5;
const x2 = 59.5;
const z = 127;

export function bedFucker() {
  const originalMode = getCameraMode();
  setCameraMode(CameraMode.FPS);
  setCameraTarget(z, y, z);
  doInSequence(
    [
      () => {
        setCameraEye(x1, y, z);
      },
      () => {
        setCameraEye(x2, y, z);
      },
      () => {
        setCameraEye(z, y, x1);
      },
      () => {
        setCameraEye(z, y, x2);
      },
    ],
    3000
  ).then(()=>{
    setCameraMode(originalMode);
  });
}

function doInSequence(tasks: (() => void)[], interval: number):Promise<void> {
  return new Promise((resolve) => {
    if (tasks.length === 0) resolve();
    setTimeout(() => {
      tasks[0]();
      doInSequence(tasks.slice(1, -1), interval);
    }, interval);
  });
}
