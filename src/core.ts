export interface Core {
  game: Game;
}
interface Game {
  state: State;
}
interface State {
  bodies: Body[];
  secret: Secret;
  physics: Physics;
  camera: Camera;
}
interface Secret {
  id: number;
}
interface Physics {
  gravity: number;
}
interface Camera {
  rotation: number[];
}
interface Body {
  ax: number;
  ay: number;
  az: number;
  flags: number;
  friction: number;
  group: number;
  hsx: number;
  hsy: number;
  hsz: number;
  id: number;
  mass: number;
  px: number;
  py: number;
  pz: number;
  qw: number;
  qx: number;
  qy: number;
  qz: number;
  restitution: number;
  rx: number;
  ry: number;
  rz: number;
  vx: number;
  vy: number;
  vz: number;
}

export class Quaternion {
  w: number;
  x: number;
  y: number;
  z: number;
  constructor(w: number, x: number, y: number, z: number) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  static parseArray(array: number[]): Quaternion {
    return new Quaternion(array[0], array[1], array[2], array[3]);
  }
  mul(q: Quaternion) {
    return new Quaternion(
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
    );
  }
  con() {
    return new Quaternion(this.w, -this.x, -this.y, -this.z);
  }
  normalize() {
    const len = this.mag();
    return new Quaternion(
      this.w / len,
      this.x / len,
      this.y / len,
      this.z / len
    );
  }
  mag() {
    return Math.sqrt(this.w ** 2 + this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
}

let resolvePromise: ((value: Core) => void) | null = null;

Object.defineProperty(Object.prototype, "isAdmin", {
  set() {
    // @ts-ignore
    delete Object.prototype.isAdmin;
    setTimeout(() => {
      if (resolvePromise) {
        resolvePromise(this as Core);
      }
    }, 1000);
  },
  configurable: true,
});

export function getCore() {
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}
