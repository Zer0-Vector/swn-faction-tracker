import FactionStatsInfo from "./FactionStatsInfo";

type StatInfo = { xpCost: number, hpValue: number };

const STAT_INFO: {[rating: number]:StatInfo} = {
  0: {
    xpCost: 0,
    hpValue: 0
  },
  1: {
    xpCost: 0,
    hpValue: 1
  },
  2: {
    xpCost: 2,
    hpValue: 2
  },
  3: {
    xpCost: 4,
    hpValue: 4
  },
  4: {
    xpCost: 6,
    hpValue: 6
  },
  5: {
    xpCost: 9,
    hpValue: 9
  },
  6: {
    xpCost: 12,
    hpValue: 12
  },
  7: {
    xpCost: 16,
    hpValue: 16
  },
  8: {
    xpCost: 20,
    hpValue: 20
  },
  9: {
    xpCost: 25,
    hpValue: 25
  },
  10: {
    xpCost: 30,
    hpValue: 30
  }
};

export default class FactionInfo {
  
  static copy(currentFaction: FactionInfo) {
    const result = new FactionInfo(currentFaction.name);
    result.stats = { ...currentFaction.stats };
    return result;
  }

  name: string;
  stats: FactionStatsInfo;

  constructor(name: string) {
    this.name = name;
    this.stats = {
      force: 0,
      cunning: 0,
      wealth: 0,
      hp: 4,
      maxHp: 4
    };
    FactionInfo.recomputeMaxHp(this);
  }

  static recomputeMaxHp(info: FactionInfo) {
    const { force, cunning, wealth } = info.stats;
    info.stats.maxHp = 4 + STAT_INFO[force].hpValue + STAT_INFO[cunning].hpValue + STAT_INFO[wealth].hpValue;
    console.log(`Recomputed MaxHp for ${info.name}: ${info.stats.maxHp}`);
  }

}
