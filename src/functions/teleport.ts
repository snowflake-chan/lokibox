import { getCore } from "src/core";
import { getSelfBody } from "src/tools/arch";

var state: State;
getCore().then((core) => {
  state = (core as Core).game.state;
});

export function teleport(x: number, y: number, z: number) {
  const body = getSelfBody();
  tryUntil(
    () => {
      body.px = x;
      body.py = y;
      body.pz = z;
    },
    () => near(body.px, x) && near(body.py, y) && near(body.pz, z)
  );
}

function tryUntil(func: () => void, condition: () => boolean) {
  let timeout = 0;
  const handler = setInterval(() => {
    if (condition() || timeout > 10) clearInterval(handler);
    func();
    timeout++;
  }, 50);
}

function near(a: number, b: number, dist: number = 5) {
  return Math.abs(a - b) < dist;
}
