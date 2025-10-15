/**
 * 团队模块
 * @module functions/teammates
 */
const teammateSet: Set<number> = new Set();
/**判断是否为队友 */
export function isTeammate(id: number) {
  return teammateSet.has(id);
}
/**新增队友 */
export function addTeammate(id: number) {
  return teammateSet.add(id);
}
/**清空队友 */
export function clearTeammates() {
  return teammateSet.clear();
}
