export type FactionStat = 
  | "hp"
  | "maxHp"
  | "force"
  | "cunning"
  | "wealth"
  | "xp";

type FactionStatsInfo = {
  [Stat in FactionStat]: number
};

export default FactionStatsInfo;
