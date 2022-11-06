export default interface FactionStatsInfo {
  hp: number;
  maxHp: number;
  force: number;
  cunning: number;
  wealth: number;
  xp: number;
  [key: string]: number;
}
