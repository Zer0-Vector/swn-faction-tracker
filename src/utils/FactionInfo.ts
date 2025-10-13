import FactionStatsInfo from "../types/FactionStatsInfo";
import GoalInfo from "../types/GoalInfo";
import { Prettify } from "../types/Prettify";

import { NamedSluggedEntity } from "./NamedElementPoset";

interface StatInfo { xpCost: number, hpValue: number }

export const STAT_INFO: {[rating: number]:StatInfo} = {
  0: {
    xpCost: 0,
    hpValue: 0,
  },
  1: {
    xpCost: 0,
    hpValue: 1,
  },
  2: {
    xpCost: 2,
    hpValue: 2,
  },
  3: {
    xpCost: 4,
    hpValue: 4,
  },
  4: {
    xpCost: 6,
    hpValue: 6,
  },
  5: {
    xpCost: 9,
    hpValue: 9,
  },
  6: {
    xpCost: 12,
    hpValue: 12,
  },
  7: {
    xpCost: 16,
    hpValue: 16,
  },
  8: {
    xpCost: 20,
    hpValue: 20,
  },
  9: {
    xpCost: 25,
    hpValue: 25,
  },
  10: {
    xpCost: 30,
    hpValue: 30,
  },
};

export default class FactionInfo implements FactionStatsInfo, NamedSluggedEntity {

  readonly id: string;
  slug: string;
  name: string;
  hp: number;
  force: number;
  cunning: number;
  wealth: number;
  xp: number;
  homeworldId?: string;
  tag?: string;
  goal?: GoalInfo;

  constructor(id: string, slug: string, name: string) {
    this.id = id;
    this.slug = slug;
    this.name = name;
    this.force = 0;
    this.cunning = 0;
    this.wealth = 0;
    this.hp = 4;
    this.xp = 0;
  }

  get maxHp(): number {
    const maxHp = 4 + STAT_INFO[this.force].hpValue + STAT_INFO[this.cunning].hpValue + STAT_INFO[this.wealth].hpValue;
    return maxHp;
  }

  static from(info: Prettify<Partial<FactionInfo> & NamedSluggedEntity>) {
    const newInfo = new FactionInfo(info.id, info.slug, info.name);
    Object.assign(newInfo, info);
    return newInfo;
  }

}
