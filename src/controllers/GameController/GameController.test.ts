// import React from "react";
import React from "react";
import { GameController } from ".";
import { STAT_INFO } from "../../types/FactionInfo";
import GameState from "../../types/GameState";

describe('GameController utility methods', () => {
  it('isInvalidStat finds invalid stats', () => {
    expect(GameController.isInvalidStat(-1)).toBe(true);
    expect(GameController.isInvalidStat(11)).toBe(true);
    expect(GameController.isInvalidStat(Math.sqrt(-1))).toBe(true);
    const keys = Object.keys(STAT_INFO).map(s => parseInt(s));
    const { min, max } = { 
      min: keys.reduce((prev, curr) => ( curr < prev ? curr : prev )), 
      max: keys.reduce((prev, curr) => ( curr > prev ? curr : prev ))
    };
    for (let i = min; i <= max; i++) {
      expect(GameController.isInvalidStat(i)).toBe(false);
    }
  });

  it('isInvalidHp detects invalid HP values', () => {
    expect(GameController.isInvalidHp(-1)).toBe(true);
    expect(GameController.isInvalidHp(Math.sqrt(-1))).toBe(true);
    expect(GameController.isInvalidHp(0)).toBe(false);
    expect(GameController.isInvalidHp(Number.MAX_SAFE_INTEGER)).toBe(false);
  });
});

describe('GameController methods', () => {
  let mockSetState: jest.Mock<void, [React.SetStateAction<GameState>]>;
  let controller: GameController;

  const gameState: GameState = {
    isLoading: false,
    factions: {
      "My Test": {
        name: "My Test",
        stats: {hp: 0, maxHp: 0, force: 0, cunning: 0, wealth: 0}
      },
      "Leave Alone": {
        name: "Leave Alone",
        stats: {hp: 0, maxHp: 0, force: 0, cunning: 0, wealth: 0}
      },
      "Test2": {
        name: "Test2",
        stats: {hp: 0, maxHp: 0, force: 0, cunning: 0, wealth: 0}
      },
    },
    factionOrder: ["My Test", "Leave Alone", "Test2"],
    assets: {
      "My Test": [],
      "Leave Alone": [],
      "Test2": []
    },
  };

  const emptyGameState: GameState = { factions: {}, factionOrder: [], assets: {}, isLoading: false };

  beforeEach(() => {
    mockSetState = jest.fn<void, [React.SetStateAction<GameState>]>();
    controller = new GameController(mockSetState);
  });

  function invokeMockSetState(callIndex: number, initialState: GameState) {
    const stateTransformer = mockSetState.mock.calls[callIndex][0];
    if (typeof stateTransformer !== "function") {
      throw new Error("stateTransformer is not a function: " + typeof stateTransformer);
    }
    return stateTransformer(initialState);
  }

  it('addFaction calls setState with new faction info', () => {
    controller.addFaction("test123");
    expect(mockSetState.mock.calls).toHaveLength(1);

    const result = invokeMockSetState(0, emptyGameState);
    expect(result.factionOrder).toHaveLength(1);
    expect(result.factionOrder[0]).toBe("test123");
    const factionNames = Object.keys(result.factions);
    expect(factionNames).toHaveLength(1);
    expect(factionNames[0]).toBe("test123");
    expect(result.factions["test123"]).toBeDefined();
    expect(result.factions["test123"].name).toBe("test123");
    expect(result.factions["test123"].stats).toEqual({ force: 0, cunning: 0, wealth: 0, hp: 4, maxHp: 4 });
    expect(result.assets["test123"]).toBeDefined();
    expect(result.assets["test123"]).toEqual([]);

    controller.addFaction("test456");
    expect(mockSetState.mock.calls).toHaveLength(2);
    
    const result2 = invokeMockSetState(1, result) as GameState;
    expect(result2).not.toBe(result);
    expect(result2.factionOrder).toHaveLength(2);
    expect(result2.factionOrder[1]).toBe("test456");
    expect(Object.keys(result2.factions)).toHaveLength(2);
    expect(result2.factions["test456"]).toBeDefined();
    expect(result2.factions["test456"].name).toBe("test456");
    expect(result2.assets["test456"]).toBeDefined();
    expect(result2.assets["test456"]).toEqual([]);
  });

  it('removeFaction removes faction info for that name', () => {
    controller.removeFaction("My Test");

    expect(mockSetState.mock.calls).toHaveLength(1);

    const result = invokeMockSetState(0, gameState);
    expect(result).not.toBe(gameState);
    expect(result).not.toEqual(gameState);
    const originalLengthMinusOne = gameState.factionOrder.length - 1;
    expect(result.factionOrder).toHaveLength(originalLengthMinusOne);
    expect(Object.keys(result.factions)).toHaveLength(originalLengthMinusOne);
    expect(Object.keys(result.assets)).toHaveLength(originalLengthMinusOne);
  });

  it('reorderFactions update factionOrder', () => {
    expect(gameState.factionOrder[0]).toBe("My Test");
    expect(gameState.factionOrder[1]).toBe("Leave Alone");
    expect(gameState.factionOrder[2]).toBe("Test2");
    
    controller.reorderFactions(0, 0);
    expect(mockSetState.mock.calls).toHaveLength(1);
    const result1 = invokeMockSetState(0, gameState);
    expect(result1.factionOrder[0]).toBe("My Test");
    expect(result1.factionOrder[1]).toBe("Leave Alone");
    expect(result1.factionOrder[2]).toBe("Test2");
    
    controller.reorderFactions(2, 0);
    expect(mockSetState.mock.calls).toHaveLength(2);
    const result2 = invokeMockSetState(1, gameState);
    expect(result2.factionOrder[0]).toBe("Test2");
    expect(result2.factionOrder[1]).toBe("My Test");
    expect(result2.factionOrder[2]).toBe("Leave Alone");
    
    controller.reorderFactions(0, 2);
    expect(mockSetState.mock.calls).toHaveLength(3);
    const result3 = invokeMockSetState(2, result2);
    expect(result3.factionOrder[0]).toBe("My Test");
    expect(result3.factionOrder[1]).toBe("Leave Alone");
    expect(result3.factionOrder[2]).toBe("Test2");
  });

  it('updateFactionName changes key in maps and factionOrder', () => {
    // TODO
  });

  it('updateForce changes force attribute for faction', () => {
    // TODO
  });

  it('updateCunning changes cunning attribute for faction', () => {
    // TODO
  });

  it('updateWealth changes wealth attribute for faction', () => {
    // TODO
  });

  it('updateHp changes Hp value for faction', () => {
    // TODO
  });

  it('updateMaxHp changes maxHp value for faction', () => {
    // TODO
  });
});
