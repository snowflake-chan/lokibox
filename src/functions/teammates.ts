const teammateSet: Set<number> = new Set();
export function isTeammate(id: number) {
  return teammateSet.has(id);
}
export function addTeammate(id: number) {
  return teammateSet.add(id);
}
export function clearTeammates() {
  return teammateSet.clear();
}
