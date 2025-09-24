import { coreService } from "src/services/coreService";

const y = 41.5;
const x1 = 192.5;
const x2 = 59.5;
const z = 127;

export async function bedFucker() {
  const state = await coreService.getState();
  const eye = state.secret.replica.camera.eye;
  const target = state.secret.replica.camera.target;
  state.secret.replica.camera.mode = 1;
  eye[1] = y;
  target[1] = y;
  setTimeout(() => {
    eye[0] = x1;
    target[0] = x1 + 1;
    eye[2] = z;
    setTimeout(() => {
      eye[0] = x2;
      target[0] = x2 + 1;
      eye[2] = z;
      setTimeout(() => {
        eye[0] = z;
        eye[2] = x1;
        target[2] = x1 + 1;
        setTimeout(() => {
          eye[0] = z;
          eye[2] = x2;
          target[2] = x2 + 1;
          setTimeout(() => {
            state.secret.replica.camera.mode = 2;
          }, 3000);
        }, 3000);
      }, 3000);
    }, 3000);
  }, 3000);
}