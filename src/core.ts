let resolvePromise: ((value: Core) => void)[] = [];

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

export function getCore() {
  if (window.location.pathname.startsWith("/p")) {
    listenPrototype("isAdmin");
  } else if (window.location.pathname.startsWith("/e")) {
    listenPrototype("permissionController");
  }
  return new Promise((resolve) => {
    resolvePromise.push(resolve);
  });
}
