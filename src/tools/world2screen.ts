export function mulMat4Vec4(m:number[], v:number[]) {
  return [
    m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3],
    m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3],
    m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
    m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3],
  ];
}

export function worldToScreen(pos:number[], camera:Camera) {
  const v = [pos[0], pos[1], pos[2], 1.0];
  const clip = mulMat4Vec4(camera.viewProjection, v);


  if (clip[3] === 0) return null;

  const ndcX = clip[0] / clip[3];
  const ndcY = clip[1] / clip[3];
  const ndcZ = clip[2] / clip[3];
  // 在摄像机后面
  if (ndcZ < 0) return null;

  const width = camera.viewport[0];
  const height = camera.viewport[1];

  return {
    x: (ndcX * 0.5 + 0.5) * width,
    y: (1 - (ndcY * 0.5 + 0.5)) * height,
    z: ndcZ,
  };
}
