/**
 * 世界坐标转屏幕坐标
 * @module tools/world2screen
 */
import { getCamera } from "./arch";

/**
 * 矩阵旋转四元数
 * @param m 矩阵
 * @param v 四元数
 * @returns 
 */
export function mulMat4Vec4(m: number[], v: number[]) {
  return [
    m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3],
    m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3],
    m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
    m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3],
  ];
}

/**
 * 世界坐标求屏幕坐标
 * @param x 
 * @param y 
 * @param z 
 * @returns 屏幕坐标
 */
export function worldToScreen(x: number, y: number, z: number) {
  const camera = getCamera();
  const v = [x, y, z, 1.0];
  const clip = mulMat4Vec4(camera.viewProjection, v);

  if (clip[3] === 0) return null;

  const ndcX = clip[0] / clip[3];
  const ndcY = clip[1] / clip[3];
  const ndcZ = clip[2] / clip[3];
  // 在摄像机后面
  //if (ndcZ < 0) return null;

  const width = camera.viewport[0];
  const height = camera.viewport[1];

  return {
    x: (ndcX * 0.5 + 0.5) * width,
    y: (1 - (ndcY * 0.5 + 0.5)) * height,
    z: ndcZ,
  };
}
