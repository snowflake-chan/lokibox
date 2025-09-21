import { getCore } from "src/core";

var autoClickerHandler: number;
var state: State;

getCore().then((core) => {
  state = (core as Core).game.state;
});

export function deployAutoClicker(interval: number, autoClickKey: number = 6) {
  autoClickerHandler = setInterval(() => {
    state.input.keyState[autoClickKey] = 1;
    setTimeout(() => {
      state.input.keyState[autoClickKey] = 0;
    }, interval / 2);
  }, interval);
}

export function clearAutoClicker() {
  if (!autoClickerHandler) return;
  clearInterval(autoClickerHandler);
  state.input.keyState[6] = 0;
}