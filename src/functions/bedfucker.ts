import { setCameraEye, setCameraMode, setCameraTarget } from "src/tools/arch";

const y = 41.5;
const x1 = 192.5;
const x2 = 59.5;
const z = 127.5;

export function bedFucker() {
  setCameraMode(1);
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
  ).then(() => {
    console.log("test");
    setCameraMode(2);
  });
}

function doInSequence(tasks: (() => void)[], interval: number): Promise<void> {
  return new Promise((resolve) => {
    tasks[0]();
    setTimeout(() => {
      if (tasks.length === 1) {
        resolve();
      } else {
        doInSequence(tasks.slice(1), interval).then(resolve);
      }
    }, interval);
  });
}
