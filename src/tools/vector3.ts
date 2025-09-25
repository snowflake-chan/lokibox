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

  sub(v: Vector3) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  sqrDist(v: Vector3) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }
}
