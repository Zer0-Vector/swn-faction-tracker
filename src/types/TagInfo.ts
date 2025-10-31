import { DiceDefinition } from "./dice";
import { FactionAttribute } from "./FactionAttribute";

interface DieTest {
  roll: DiceDefinition;
  comparison: "GREATER_OR_EQUAL";
  threshold: number;
}

type TagEffect =
  | {
      type: "ASSUME_STAT";
      details: {
        tl?: number;
      };
    }
  | {
      type: "ASSUME_TAG";
      details: {
        tag: string;
        target?: "homeworld";
      };
    }
  | {
      type: "BONUS_DIE";
      details: {
        limitPerTurn?: 1;
        when: "ATTACKING" | "DEFENDING" | "DETECT_STEALTH";
        with?: FactionAttribute | string;
        versus?: FactionAttribute | { tl: 5 };
        target?: "homeworld" | { tl: 0 };
        during?: "SIEZE_PLANET";
        die: DiceDefinition | "*";
      };
    }
  | {
      type: "GOAL_COMPLETED_BONUS";
      details: {
        goal: string;
        test: DieTest;
        bonus: {
          type: "XP";
          amount: 1;
        };
      };
    }
  | {
      type: "REROLL";
      details: {
        dieValue: 1;
      };
    }
  | {
      type: "LOSE_TIES";
      details: {
        when: "ATTACKING";
      };
    }
  | {
      type: "ASSET_ABILITY";
      details: {
        type: "MOVE";
        distance: 1;
      };
    }
  | {
      type: "TAX";
      details: {
        when: "MOVE";
        onto: {
          contains: "Base of Influence";
        };
        pay: 1;
        to: "FACTION";
      };
    }
  | {
      type: "PERMISSION";
    }
  | {
      type: "DISCOUNT";
      details: {
        on: {
          tl: 4;
        };
        discount: 1;
      };
    }
  | {
      type: "BONUS_ACTION_AVAILABLE";
      details: {
        action: "Teach Planetary Population";
      };
    }
  | {
      type: "FORCE_REROLL";
      details: {
        limitPerTurn: 1;
        die: DiceDefinition;
      };
    }
  | {
      type: "GAIN_CREDIT";
      details: {
        amount: 1;
        when: "ASSET_DESTROYED";
        owner: "SELF" | "ENEMY";
      };
    }
  | {
      type: "STEALTH_ASSETS";
    }
  | {
      type: "TL4_BASE_WORLD";
    }
  | {
      type: "BUILD_STARSHIP";
      details: {
        population: 10000;
      };
    }
  | {
      type: "BONUS_ASSET_AVAILABLE";
      details: {
        asset: "Gengineered Slaves";
      };
    };

export default interface TagInfo {
  name: string;
  attributes?: {
    name: "location";
    type: "LOCATION";
  }[];
  effects: TagEffect[];
}
