export interface Core {
  game: Game;
}
interface Game {
  state: State;
}
interface State {
  bodies: Body[];
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

let resolvePromise: ((value: Core) => void) | null = null;

Object.defineProperty(Object.prototype, "isAdmin", {
  set() {
    // @ts-ignore
    delete Object.prototype.isAdmin;
    if(resolvePromise){
      resolvePromise(this);
    };
  },
  configurable: true,
});

export function getCore() {
  return new Promise((resolve)=>{
    resolvePromise=resolve;
  });
}
