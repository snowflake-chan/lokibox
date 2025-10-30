import { writable, type Writable } from "svelte/store";

export const funcStore: Writable<string[]> = writable([]);

export function switchFunc(name: string) {
  console.log(name);
  funcStore.update((funcList) => {
    if (!funcList.includes(name)) {
      funcList.push(name);
    } else {
      funcList.splice(funcList.indexOf(name), 1);
    }
    return funcList;
  });
}
