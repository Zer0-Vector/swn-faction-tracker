import AssetInfo from "../types/AssetInfo";

const WealthAssetList = [
  // 1
  "Franchise",
  "Harvesters",
  "Local Investments",

  // 2

  // 3

  // 4

  // 5

  // 6

  // 7

  // 8
] as const;

const ForceAssetList = [
  // 1
  "Security Personnel",
  "Hitmen",
  "Militia Unit",

  // 2

  // 3

  // 4

  // 5

  // 6

  // 7

  // 8
] as const;

const CunningAssetList = [
  // 1
  "Smugglers",
  "Informers",
  "False Front",

  // 2
  "Lobbyists",
  "Saboteurs",
  "Blackmail",
  "Seductress",
  
  // 3
  "Cyberninjas",
  "Stealth",
  "Covert Shipping",

  // 4

  // 5

  // 6

  // 7

  // 8
] as const;

const AssetList = [
  "Base of Influence",
  ...CunningAssetList,
  ...ForceAssetList,
  ...WealthAssetList,
] as const;

type AssetKeys = typeof AssetList[number];

type AssetMap = {
  [key in AssetKeys]: AssetInfo;
};

const ASSETS: AssetMap = {
  /* Base of Influence */
  "Base of Influence": {
    description: "This asset is special, and is required for purchasing or upgrading units on a particular world. Any damage done to a Base of Influence is also done to a faction's hit points. The cost of a Base of Influence equals its maximum hit points, which can be any number up to the total maximum hit points of its owning faction. A faction's bases of influence don't count against their maximum assets. A Base of Influence can only be purchased with the Expand Influence action.",
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
    restriction: null,
  },

  /* Cunning 1 */
  "Smugglers": {
    description: "Men and women skilled in extracting personnel. For one FacCred, the smugglers asset can transport itself and/or any one Special Forces unit to a planet up to two hexes away",
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
        damage: "1d4",
      },
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
        includeSelf: true,
      },
    },
    restriction: null,
  },
  "Informers": {
    description: "Minions that lace a planet's underworld, watchful for intruders. They can choose to Attack a faction without specifying a target asset. On a successful Cunning vs. Cunning attack, all Stealthed assets on the planet belonging to that faction are revealed. Informers can target a faction even if none of their assets are visible on a world; at worst, they simply learn that there are no stealthed assets.",
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
        type: "REVEAL_STEALTHED",
      },
    },
    counter: null,
    note: ["S"],
    upkeep: 0,
    action: null,
    restriction: null,
  },
  "False Front": {
    description: "This asset allows a faction to preserve more valuable resources. If another asset on the planet suffers enough damage to destroy it, the faction can sacrifice the false front instead to nullify the killing blow.",
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
      details: null,
    },
    restriction: null,
  },

  /* Cunning 2 */
  "Lobbyists": {
    description: "Usable to block the governmental permission that is sometimes required to buy an asset or transport it into a system. When a rival faction gains permission to do so, the Lobbyists can make an immediate Cunning vs. Cunning test against the faction; if successful, the permission is withdrawn and cannot be re-attempted until next turn.",
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
          defense: "CUNNING",
        },
        effect: ["PERMISSION_DENIED"],
      },
    },
    restriction: null,
  },
  "Saboteurs": {
    description: "Minions rained in launching strikes against enemy operations. An asset attacked by saboteurs cannot apply any Use Asset Ability action until the start of the attacking faction's next turn. This applies whether or not the attack was successful.",
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
        damage: "2d4",
      },
    },
    counter: null,
    note: ["S"],
    upkeep: 0,
    action: {
      type: "SABOTAGE",
      cost: 0,
      details: null,
    },
    restriction: null,
  },
  "Blackmail": {
    description: "Selectively degrade the effectiveness of an asset. Any attempt to attack or defend against Blackmail loses any bonus dice earned by tags.",
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
        damage: "1d4+1",
      },
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
        effect: ["PREVENT_TAG_DICE"],
      },
    },
    restriction: null,
  },
  "Seductress": {
    description: "They and their male equivalents subvert the leadership of enemy assets. As an action, a Seductress can travel to any world within one hex. As an attack, a Seductress does no damage, but an asset that has been successfully attacked immediately reveals any other Stealthed assets of that faction on the planet. Only Special Forces units can attack a Seductress.",
    attribute: "CUNNING",
    level: 2,
    maxHp: 4,
    cost: 4,
    tl: 0,
    type: "SPECIAL_FORCES",
    attack: {
      offense: "CUNNING",
      defense: "CUNNING",
      result: { type: "REVEAL_STEALTHED" },
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
        includeSelf: true,
      },
    },
    restriction: {
      type: "ATTACKER",
      details: {
        only: "SPECIAL_FORCES",
      },
    },
  },
  
  /* Cunning 3 */
  "Cyberninjas": {
    description: "TODO",
    attribute: "CUNNING",
    level: 3,
    maxHp: 4,
    cost: 6,
    tl: 4,
    type: "SPECIAL_FORCES",
    attack: {
      offense: "CUNNING",
      defense: "CUNNING",
      result: {
        type: "DAMAGE",
        damage: "2d6",
      },
    },
    counter: null,
    note: [],
    upkeep: 0,
    action: null,
    restriction: null,
  },
  "Stealth": {
    description: "TODO",
    attribute: "CUNNING",
    level: 3,
    maxHp: null,
    cost: 2,
    tl: 0,
    type: "TACTIC",
    attack: null,
    counter: null,
    note: ["S"],
    upkeep: 0,
    restriction: null,
    action: null,
  },
  "Covert Shipping": {
    description: "TODO",
    attribute: "CUNNING",
    level: 3,
    maxHp: 4,
    cost: 8,
    tl: 4,
    type: "LOGISTICS_FACILITY",
    attack: null,
    counter: null,
    upkeep: 0,
    note: ["A", "S"],
    restriction: null,
    action: {
      type: "MOVE",
      cost: 1,
      details: {
        distance: 3,
        includeSelf: false,
        quantity: 1,
        types: ["SPECIAL_FORCES"],
      },
    },
  },

  /* Cunning 4 */
  /* Cunning 5 */
  /* Cunning 6 */
  /* Cunning 7 */
  /* Cunning 8 */
  
  /* Force 1 */
  "Security Personnel": {
    description: "Standard civilian guards or policemen, usually equipped with nonlethal weaponry or personal sidearms.",
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
    description: "Crudely-equipped thugs and assassins with minimal training that have been aimed at a rival faction's leadership.",
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
    description: "Groups of lightly-equipped irregular troops with rudimentary military training but no heavy support.",
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
  "Franchise": {
    description: "TODO",
    attribute: "WEALTH",
    level: 1,
    maxHp: 3,
    cost: 2,
    tl: 2,
    type: "FACILITY",
    attack: {
      offense: "WEALTH",
      defense: "WEALTH",
      result: {
        type: "DAMAGE",
        damage: "1d4",
      },
    },
    counter: "1d4-1",
    note: ["S"],
    restriction: null,
    upkeep: 0,
    action: {
      type: "ATTACK_SIDE_EFFECT",
      cost: 0,
      details: {
        defenderCharged: 1,
      },
    },
  },
  "Harvesters": {
    description: "TODO",
    attribute: "WEALTH",
    level: 1,
    maxHp: 4,
    cost: 2,
    tl: 0,
    type: "FACILITY",
    attack: null,
    counter: "1d4",
    note: ["A"],
    upkeep: 0,
    restriction: null,
    action: {
      type: "HARVEST",
      cost: 0,
      details: {
        roll: "1d6",
        threshold: 3,
      },
    },
  },
  "Local Investments": {
    description: "TODO",
    attribute: "WEALTH",
    level: 1,
    maxHp: 2,
    cost: 1,
    tl: 2,
    type: "FACILITY",
    attack: {
      offense: "WEALTH",
      defense: "WEALTH",
      result: {
        type: "DAMAGE",
        damage: "1d4-1",
      },
    },
    counter: null,
    note: ["S"],
    upkeep: 0,
    restriction: null,
    action: {
      type: "PURCHASE_TAX",
      cost: 0,
      details: {
        tax: 1,
      },
    },
  },

  /* Wealth 2 */
  /* Wealth 3 */
  /* Wealth 4 */
  /* Wealth 5 */
  /* Wealth 6 */
  /* Wealth 7 */
  /* Wealth 8 */
};

export default ASSETS;
