import RuntimeGameState from "../types/RuntimeGameState";

import { GameController, GameStateSetter } from "./GameController";

let gameController: GameController;

const gameState = new RuntimeGameState({
  assets: [],
  factionOrder: [],
  factions: [],
  locations: [],
  locationsOrder: [],
  mode: "EDIT",
});

const setFn = jest.fn();

describe('GameController', () => {
  beforeEach(() => {
    gameController = new GameController(gameState, setFn as GameStateSetter);
  });

  it('addFaction', () => {
    const rtgsAddFaction = jest.spyOn(gameState, 'addFaction');
    const result = gameController.addFaction("Test Faction");
    expect(result).not.toBeUndefined();
    expect(rtgsAddFaction).toBeCalledTimes(1);
    expect(setFn).toBeCalledTimes(1);
  });

  it('addAsset', () => {
    const rtgsAddAsset = jest.spyOn(gameState, 'addAsset');
    const result = gameController.addAsset("test-faction", "Asset Test");
    expect(result).not.toBeUndefined();
    expect(rtgsAddAsset).toBeCalledTimes(1);
    expect(rtgsAddAsset).toBeCalledWith("test-faction", "Asset Test");
    expect(setFn).toBeCalledTimes(1);
  });
});
