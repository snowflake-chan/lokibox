export interface Core {
  game: Game;
}
export interface Game {
  state: State;
}
export interface State {
  bodies: Body[];
  secret: Secret;
  physics: Physics;
  camera: Camera;
  playerIndex: object;
  replica: StateReplica;
  input: Input;
}
interface Secret {
  id: number;
  replica: SecretReplica;
}
interface Physics {
  gravity: number;
}
interface Camera {
  rotation: number[];
}
interface Input {
  mouseButton: number;
  keyState: number[];
}
export interface Body {
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

interface StateReplica {
  players: Player[];
}
interface SecretReplica {
  camera: ReplicaCamera;
}

interface ReplicaCamera {
  distance: number;
  fovY: number;
  freezedAxis: number;
  mode: number;
  targetId: number;
  eye: number[];
  target: number[];
  up: number[];
}
export interface Player {
  id: number;
  emissive: number;
  name: string;
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
  cross(q: Quaternion) {
    return new Quaternion(
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
    );
  }
  inv() {
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
    return Math.sqrt(
      this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z
    );
  }
  add(q: Quaternion) {
    return new Quaternion(
      this.w + q.w,
      this.x + q.x,
      this.y + q.y,
      this.z + q.z
    );
  }
}

export class Vector3 {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  static parseArray(array: number[]): Vector3 {
    return new Vector3(array[0], array[1], array[2]);
  }
  sqrMag() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  mag() {
    return Math.sqrt(this.sqrMag());
  }
  cross(v: Vector3) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }
  dot(v: Vector3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  cos(v: Vector3) {
    return this.dot(v) / this.mag() / v.mag();
  }
  sin(v: Vector3) {
    const cos = this.cos(v);
    return 1 - cos * cos;
  }
  scale(times: number) {
    return new Vector3(this.x * times, this.y * times, this.z * times);
  }
}

let resolvePromise: ((value: Core) => void) | null = null;

function listenPrototype(param: string) {
  Object.defineProperty(Object.prototype, param, {
    set() {
      // @ts-ignore
      delete Object.prototype[param];
      const core = this as Core;
      const handler = setInterval(() => {
        if (core.game && resolvePromise) {
          const playerId = core.game.state.secret.id;
          const playerBody = core.game.state.bodies.find(
            (v) => v.id == playerId
          );
          if (playerBody) {
            resolvePromise(core);
            clearInterval(handler);
          }
        }
      }, 100);
    },
    configurable: true,
  });
}

export function getCore() {
  if (window.location.pathname.startsWith("/p")) {
    console.log("[lokibox] play mode");
    listenPrototype("isAdmin");
  } else if (window.location.pathname.startsWith("/e")) {
    console.log("[lokibox] edit mode");
    listenPrototype("permissionController");
  }
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}
