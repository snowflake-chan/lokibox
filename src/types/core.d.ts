declare interface Core {
  game: Game;
}
declare interface Game {
  state: State;
}
declare interface State {
  bodies: Body[];
  secret: Secret;
  physics: Physics;
  camera: Camera;
  playerIndex: object;
  replica: StateReplica;
  input: Input;
}
declare interface Secret {
  id: number;
  replica: SecretReplica;
}
declare interface Physics {
  gravity: number;
}
declare interface Camera {
  rotation: number[];
}
declare interface Input {
  mouseButton: number;
  keyState: number[];
}
declare interface Body {
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
declare interface StateReplica {
  players: Player[];
}
declare interface SecretReplica {
  camera: ReplicaCamera;
}
declare interface ReplicaCamera {
  distance: number;
  fovY: number;
  freezedAxis: number;
  mode: number;
  targetId: number;
  eye: number[];
  target: number[];
  up: number[];
}
declare interface Player {
  id: number;
  emissive: number;
  name: string;
}

