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