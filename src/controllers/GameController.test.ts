import PurchasedAsset from "../types/PurchasedAsset";
import RuntimeGameState from "../types/RuntimeGameState";
import StoredGameState from "../types/StoredGameState";

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
    const faction = gameController.addFaction("Test Faction");
    expect(faction).not.toBeUndefined();
    expect(rtgsAddFaction).toBeCalledTimes(1);
    expect(setFn).toBeCalledTimes(1);

    const setter = setFn.mock.calls[0][0] as (prev: StoredGameState) => StoredGameState;
    const result = setter({} as StoredGameState);
    expect(result).not.toBeUndefined();
    expect(result.factions.length).toEqual(1);
    expect(result.factionOrder.length).toEqual(1);
    expect(result.factionOrder[0]).toEqual(faction.id);
    expect(result.factions[0][1]).toEqual(faction);
  });

  it('addAsset', () => {
    const rtgsAddAsset = jest.spyOn(gameState, 'addAsset');
    const asset = gameController.addAsset("test-faction", "Asset Test");
    expect(asset).not.toBeUndefined();
    expect(rtgsAddAsset).toBeCalledTimes(1);
    expect(rtgsAddAsset).toBeCalledWith("test-faction", "Asset Test");
    expect(setFn).toBeCalledTimes(1);
    const setter = setFn.mock.calls[0][0] as (prev: StoredGameState) => StoredGameState;
    const result = setter({} as StoredGameState);
    expect(result).not.toBeUndefined();
    expect(result.assets.length).toEqual(1);
    expect(result.assets[0][1]).toEqual({
      id: { displayName: "Asset Test", index: 1 },
      hp: 0,
    } as PurchasedAsset);
  });
});
