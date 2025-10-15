/**@class 三维向量类 */
export class Vector3 {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * 由数组转换为向量
   * @param array 三维数组
   * @returns 三维向量
   */
  static parseArray(array: number[]): Vector3 {
    return new Vector3(array[0], array[1], array[2]);
  }
  /**模的平方 */
  sqrMag() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**模 */
  mag() {
    return Math.sqrt(this.sqrMag());
  }
  /**外积 */
  cross(v: Vector3) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }
  /**内积 */
  dot(v: Vector3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  /**夹角余弦值 */
  cos(v: Vector3) {
    return this.dot(v) / this.mag() / v.mag();
  }
  /**夹角正弦值 */
  sin(v: Vector3) {
    const cos = this.cos(v);
    return 1 - cos * cos;
  }
  /**数乘 */
  scale(times: number) {
    return new Vector3(this.x * times, this.y * times, this.z * times);
  }
  /**减 */
  sub(v: Vector3) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  /**距离平方 */
  sqrDist(v: Vector3) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }
}
