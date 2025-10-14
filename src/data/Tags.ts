import TagInfo from "../types/TagInfo";

export const TagsList = [
  "Colonists",
  "Deep Rooted",
  "Eugenics Cult",
  "Exchange Consulate",
  "Fanatical",
  "Imperialists",
  "Machiavellian",
  "Mercenary Group",
  "Perimeter Agency",
  "Pirates",
  "Planetary Government",
  "Plutocratic",
  "Preceptor Archive",
  "Psychic Academy",
  "Savage",
  "Scavengers",
  "Secretive",
  "Technical Expertise",
  "Theocratic",
  "Warlike",
] as const;

export type Tag = (typeof TagsList)[number];

type TagsMap = {
  [K in Tag]: TagInfo;
};

export const TAGS: TagsMap = {
  Colonists: {
    name: "Colonists",
    effects: [
      {
        type: "ASSUME_STAT",
        details: {
          tl: 4,
        },
      },
      {
        type: "ASSUME_TAG",
        details: {
          tag: "Planetary Government",
          target: "homeworld",
        },
      },
    ],
  },
  "Deep Rooted": {
    name: "Deep Rooted",
    effects: [
      {
        type: "BONUS_DIE",
        details: {
          when: "DEFENDING",
          target: "homeworld",
          die: "1d10",
        },
      },
    ],
  },
  "Eugenics Cult": {
    name: "Eugenics Cult",
    effects: [
      {
        type: "BONUS_ASSET_AVAILABLE",
        details: {
          asset: "Gengineered Slaves",
        },
      },
      {
        type: "BONUS_DIE",
        details: {
          when: "DEFENDING",
          with: "Gengineered Slaves",
          die: "1d10",
        },
      },
    ],
  },
  "Exchange Consulate": {
    name: "Exchange Consulate",
    effects: [
      {
        type: "GOAL_COMPLETED_BONUS",
        details: {
          goal: "Peacable Kingdom",
          test: {
            roll: "1d6",
            comparison: "GREATER_OR_EQUAL",
            threshold: 4,
          },
          bonus: {
            type: "XP",
            amount: 1,
          },
        },
      },
      {
        type: "BONUS_DIE",
        details: {
          limitPerTurn: 1,
          when: "DEFENDING",
          versus: "WEALTH",
          die: "1d10",
        },
      },
    ],
  },
  Fanatical: {
    name: "Fanatical",
    effects: [
      {
        type: "REROLL",
        details: {
          dieValue: 1,
        },
      },
      {
        type: "LOSE_TIES",
        details: {
          when: "ATTACKING",
        },
      },
    ],
  },
  Imperialists: {
    name: "Imperialists",
    effects: [
      {
        type: "BONUS_DIE",
        details: {
          when: "ATTACKING",
          during: "SIEZE_PLANET",
          die: "1d10",
        },
      },
    ],
  },
  Machiavellian: {
    name: "Machiavellian",
    effects: [
      {
        type: "BONUS_DIE",
        details: {
          limitPerTurn: 1,
          when: "ATTACKING",
          with: "CUNNING",
          die: "1d10",
        },
      },
    ],
  },
  "Mercenary Group": {
    name: "Mercenary Group",
    effects: [
      {
        type: "ASSET_ABILITY",
        details: {
          type: "MOVE",
          distance: 1,
        },
      },
    ],
  },
  "Perimeter Agency": {
    name: "Perimeter Agency",
    effects: [
      {
        type: "BONUS_DIE",
        details: {
          limitPerTurn: 1,
          when: "ATTACKING",
          versus: {
            tl: 5,
          },
          die: "1d10",
        },
      },
      {
        type: "BONUS_DIE",
        details: {
          when: "DETECT_STEALTH",
          die: "*",
        },
      },
    ],
  },
  Pirates: {
    name: "Pirates",
    effects: [
      {
        type: "TAX",
        details: {
          when: "MOVE",
          onto: {
            contains: "Base of Influence",
          },
          pay: 1,
          to: "FACTION",
        },
      },
    ],
  },
  "Planetary Government": {
    name: "Planetary Government",
    attributes: [
      {
        name: "location",
        type: "LOCATION",
      },
    ],
    effects: [
      {
        type: "PERMISSION",
      },
    ],
  },
  Plutocratic: {
    name: "Plutocratic",
    effects: [
      {
        type: "BONUS_DIE",
        details: {
          limitPerTurn: 1,
          when: "ATTACKING",
          with: "WEALTH",
          die: "1d10",
        },
      },
    ],
  },
  "Preceptor Archive": {
    name: "Preceptor Archive",
    effects: [
      {
        type: "DISCOUNT",
        details: {
          on: {
            tl: 4,
          },
          discount: 1,
        },
      },
      {
        type: "BONUS_ACTION_AVAILABLE",
        details: {
          action: "Teach Planetary Population",
        },
      },
    ],
  },
  "Psychic Academy": {
    name: "Psychic Academy",
    effects: [
      {
        type: "FORCE_REROLL",
        details: {
          limitPerTurn: 1,
          die: "1d10",
        },
      },
    ],
  },
  Savage: {
    name: "Savage",
    effects: [
      {
        type: "BONUS_DIE",
        details: {
          limitPerTurn: 1,
          when: "DEFENDING",
          target: {
            tl: 0,
          },
          die: "1d10",
        },
      },
    ],
  },
  Scavengers: {
    name: "Scavengers",
    effects: [
      {
        type: "GAIN_CREDIT",
        details: {
          amount: 1,
          when: "ASSET_DESTROYED",
          owner: "SELF",
        },
      },
      {
        type: "GAIN_CREDIT",
        details: {
          amount: 1,
          when: "ASSET_DESTROYED",
          owner: "ENEMY",
        },
      },
    ],
  },
  Secretive: {
    name: "Secretive",
    effects: [
      {
        type: "STEALTH_ASSETS",
      },
    ],
  },
  "Technical Expertise": {
    name: "Technical Expertise",
    effects: [
      {
        type: "TL4_BASE_WORLD",
      },
      {
        type: "BUILD_STARSHIP",
        details: {
          population: 10000,
        },
      },
    ],
  },
  Theocratic: {
    name: "Theocratic",
    effects: [
      {
        type: "BONUS_DIE",
        details: {
          limitPerTurn: 1,
          when: "DEFENDING",
          versus: "CUNNING",
          die: "1d10",
        },
      },
    ],
  },
  Warlike: {
    name: "Warlike",
    effects: [
      {
        type: "BONUS_DIE",
        details: {
          limitPerTurn: 1,
          when: "ATTACKING",
          with: "FORCE",
          die: "1d10",
        },
      },
    ],
  },
};
