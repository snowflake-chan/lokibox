/**
 * Box3 Core获取模块
 * @module core
 */
import { unsafeWindow } from "$";

let resolvePromise: ((value: Core) => void)[] = [];

/**
 * 监听原型创建 
 * @param param 监听目标key
 */
function listenPrototype(param: string) {
  Object.defineProperty(Object.prototype, param, {
    set() {
      // @ts-ignore
      delete Object.prototype[param];
      const core = this as Core;
      (unsafeWindow as any).core = core;
      const handler = setInterval(() => {
        if (core.game && resolvePromise) {
          const playerId = core.game.state.secret.id;
          const playerBody = core.game.state.bodies.find(
            (v) => v.id == playerId
          );
          if (playerBody) {
            resolvePromise.forEach((v) => {
              v(core);
            });
            clearInterval(handler);
          }
        }
      }, 100);
    },
    configurable: true,
  });
}

/**获取Core */
export function getCore(): Promise<Core> {
  let param: string;
  if (window.location.pathname.startsWith("/p")) {
    param = "isAdmin";
  } else if (window.location.pathname.startsWith("/e")) {
    param = "permissionController";
  } else {
    param = "";
  }
  listenPrototype(param);

  return new Promise((resolve) => {
    resolvePromise.push(resolve);
  });
}
