export const funcList: string[] = [];
export function switchFunc(name: string) {
  if (funcList.includes(name)) {
    funcList.push(name);
  } else {
    funcList.splice(funcList.indexOf(name), 1);
  }
}
