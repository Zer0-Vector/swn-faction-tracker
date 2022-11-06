import AssetInfo from "../types/AssetInfo";

interface AssetMap {
  [key: string]: AssetInfo;
}

const ASSETS: AssetMap = {
  /* Base of Influence */
  "Base of Influence": {
    attribute: "SPECIAL",
    level: 1,
    maxHp: null,
    cost: null,
    tl: 0,
    type: "SPECIAL",
    attack: null,
    counter: null,
    note: ["S"],
    upkeep: 0,
    action: null,
    restriction: null
  },

  /* Cunning 1 */
  "Smugglers": {
    attribute: "CUNNING",
    level: 1,
    maxHp: 4,
    cost: 2,
    tl: 4,
    type: "STARSHIP",
    attack: {
      offense: "CUNNING",
      defense: "WEALTH",
      result: {
        type: "DAMAGE",
        damage: "1d4"
      }
    },
    counter: null,
    note: ["A"],
    upkeep: 0,
    action: {
      type: "MOVE",
      cost: 1,
      details: {
        distance: 2,
        types: ["SPECIAL_FORCES"],
        quantity: 1,
        includeSelf: true
      }
    },
    restriction: null
  },
  "Informers": {
    attribute: "CUNNING",
    level: 1,
    maxHp: 3,
    cost: 2,
    tl: 0,
    type: "SPECIAL_FORCES",
    attack: {
      offense: "CUNNING",
      defense: "CUNNING",
      result: {
        type: "REVEAL_STEALTHED"
      }
    },
    counter: null,
    note: ["S"],
    upkeep: 0,
    action: null,
    restriction: null
  },
  "False Front": {
    attribute: "CUNNING",
    level: 1,
    maxHp: 2,
    cost: 1,
    tl: 0,
    type: "LOGISTICS_FACILITY",
    attack: null,
    counter: null,
    note: ["S"],
    upkeep: 0,
    action: {
      type: "SACRIFICE",
      cost: 0,
      details: null
    },
    restriction: null
  },

  /* Cunning 2 */
  "Lobbyists": {
    attribute: "CUNNING",
    level: 2,
    maxHp: 4,
    cost: 4,
    tl: 0,
    type: "SPECIAL_FORCES",
    attack: null,
    counter: null,
    note: ["S"],
    upkeep: 0,
    action: {
      type: "INSTANT",
      cost: 0,
      details: {
        trigger: ["PERMISSION_GRANTED"],
        test: {
          offense: "CUNNING",
          defense: "CUNNING"
        },
        effect: ["PERMISSION_DENIED"]
      }
    },
    restriction: null
  },
  "Saboteurs": {
    attribute: "CUNNING",
    level: 2,
    maxHp: 6,
    cost: 5,
    tl: 0,
    type: "SPECIAL_FORCES",
    attack: {
      offense: "CUNNING",
      defense: "CUNNING",
      result: {
        type: "DAMAGE",
        damage: "2d4"
      }
    },
    counter: null,
    note: ["S"],
    upkeep: 0,
    action: {
      type: "SABOTAGE",
      cost: 0,
      details: null
    },
    restriction: null
  },
  "Blackmail": {
    attribute: "CUNNING",
    level: 2,
    maxHp: 4,
    cost: 4,
    tl: 0,
    type: "TACTIC",
    attack: {
      offense: "CUNNING",
      defense: "CUNNING",
      result: {
        type: "DAMAGE",
        damage: "1d4+1"
      }
    },
    counter: null,
    note: ["S"],
    upkeep: 0,
    action: {
      type: "INSTANT",
      cost: 0,
      details: {
        trigger: ["ATTACK", "DEFEND"],
        test: null,
        effect: ["PREVENT_TAG_DICE"]
      }
    },
    restriction: null
  },
  "Seductress": {
    attribute: "CUNNING",
    level: 2,
    maxHp: 4,
    cost: 4,
    tl: 0,
    type: "SPECIAL_FORCES",
    attack: {
      offense: "CUNNING",
      defense: "CUNNING",
      result: { type: "REVEAL_STEALTHED" }
    },
    counter: null,
    note: ["S", "A"],
    upkeep: 0,
    action: {
      type: "MOVE",
      cost: 0,
      details: {
        distance: 1,
        types: [],
        quantity: 1,
        includeSelf: true
      }
    },
    restriction: {
      type: "ATTACKER",
      details: {
        only: "SPECIAL_FORCES"
      }
    }
  },
  
  /* Cunning 3 */
  /* Cunning 4 */
  /* Cunning 5 */
  /* Cunning 6 */
  /* Cunning 7 */
  /* Cunning 8 */
  
  /* Force 1 */
  "Security Personnel": {
    attribute: "FORCE",
    level: 1,
    maxHp: 3,
    cost: 2,
    tl: 0,
    type: "MILITARY_UNIT",
    attack: {
      offense: "FORCE",
      defense: "FORCE",
      result: {
        type: "DAMAGE",
        damage: "1d3+1",
      },
    },
    counter: "1d4",
    upkeep: 0,
    note: [],
    action: null,
    restriction: null,
  },
  "Hitmen": {
    attribute: "FORCE",
    level: 1,
    maxHp: 1,
    cost: 2,
    tl: 0,
    type: "SPECIAL_FORCES",
    attack: {
      offense: "FORCE",
      defense: "CUNNING",
      result: {
        type: "DAMAGE",
        damage: "1d6",
      },
    },
    counter: null,
    note: [],
    upkeep: 0,
    action: null,
    restriction: null,
  },
  "Militia Unit": {
    attribute: "FORCE",
    level: 1,
    maxHp: 4,
    cost: 4,
    tl: 3,
    type: "MILITARY_UNIT",
    attack: {
      offense: "FORCE",
      defense: "FORCE",
      result: {
        type: "DAMAGE",
        damage: "1d6",
      },
    },
    counter: "1d4+1",
    note: ["P"],
    upkeep: 0,
    action: null,
    restriction: null,
  },

  /* Force 2 */
  /* Force 3 */
  /* Force 4 */
  /* Force 5 */
  /* Force 6 */
  /* Force 7 */
  /* Force 8 */
  
  /* Wealth 1 */
  /* Wealth 2 */
  /* Wealth 3 */
  /* Wealth 4 */
  /* Wealth 5 */
  /* Wealth 6 */
  /* Wealth 7 */
  /* Wealth 8 */
};

export default ASSETS;
