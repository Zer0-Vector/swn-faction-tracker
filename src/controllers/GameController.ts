import React from "react";
import RuntimeGameState from "../types/RuntimeGameState";
import StoredGameState from "../types/StoredGameState";

export interface IGameController {
  removeAsset(selectedFaction: string, selectedAsset: string, assetId: number): void;
  addAsset(selectedFaction: string, assetName: string): void;
  updateTag(name: string, tag: string): void;
  reorderFactions(sourceIndex: number, destinationIndex: number): void;
  addFaction(name: string): void;
  removeFaction(name: string): void;
  updateFactionName(currentName: string, newName: string): void;
  updateForce(name: string, force: number): void;
  updateCunning(name: string, cunning: number): void;
  updateWealth(name: string, wealth: number): void;
  updateHp(name: string, hp: number): void;
  updateMaxHp(name: string, maxHp: number): void;
  updateHomeworld(name: string, homeworld: string): void;
}

type GameStateSetter = React.Dispatch<React.SetStateAction<StoredGameState>>;

export class GameController implements IGameController {

  private runtimeState: RuntimeGameState;
  private setState: GameStateSetter;

  constructor(runtimeState: RuntimeGameState, setState: GameStateSetter) {
    this.runtimeState = runtimeState;
    this.setState = setState;
  }

  static isInvalidStat(val: number) {
    return isNaN(val) || val < 0 || val > 10;
  }

  static isInvalidHp(val: number) {
    return isNaN(val) || val < 0;
  }

  #setFactions(setOrder = false) {
    if (setOrder) {
      this.setState(prev => ({
        ...prev,
        factionOrder: this.runtimeState.factionOrder,
        factions: Array.from(this.runtimeState.factions.entries()),
      }));
    } else {
      this.setState(prev => ({
        ...prev,
        factions: Array.from(this.runtimeState.factions.entries()),
      }));
    }
  }

  #setFactionOrder() {
    this.setState(prev => ({
      ...prev,
      factionOrder: this.runtimeState.factionOrder
    }));
  }

  #setAssets() {
    this.setState(prev => ({
      ...prev,
      assets: Array.from(this.runtimeState.assets.entries()),
    }));
  }

  #setAll() {
    this.setState((state: StoredGameState) => {
      return {
        ...state,
        factions: Array.from(this.runtimeState.factions.entries()),
        factionOrder: this.runtimeState.factionOrder,
        assets: Array.from(this.runtimeState.assets.entries()),
      };
    });
  }

  reorderFactions(sourceIndex: number, destinationIndex: number): void {
    console.log("Reordering factions...");
    this.runtimeState.reorderFactions(sourceIndex, destinationIndex);
    this.#setFactionOrder();
  }

  addFaction(name: string): void {
    if (name.trim().length === 0) {
      return;
    }
    console.log("Adding Faction: " + name);
    this.runtimeState.addFaction(name);
    this.#setFactions(true);
  }

  removeFaction(name: string): void {
    console.log("Removing faction: " + name);
    this.runtimeState.removeFaction(name);
    this.#setAll();
  }

  updateFactionName(currentName: string, newName: string): void {
    if (newName.trim().length <= 0) {
      return;
    }

    this.runtimeState.updateFactionName(currentName, newName);
    this.#setAll();
  }

  updateForce(name: string, force: number): void {
    if (GameController.isInvalidStat(force)) {
      return;
    }
    this.runtimeState.updateForce(name, force);
    this.#setFactions();
  }

  updateCunning(name: string, cunning: number): void {
    if (GameController.isInvalidStat(cunning)) {
      return;
    }

    this.runtimeState.updateCunning(name, cunning);
    this.#setFactions();
  }

  updateWealth(name: string, wealth: number): void {
    if (GameController.isInvalidStat(wealth)) {
      return;
    }

    this.runtimeState.updateWealth(name, wealth);
    this.#setFactions();
  }

  updateHp(name: string, hp: number): void {
    if (GameController.isInvalidHp(hp)) {
      return;
    }

    this.runtimeState.updateHp(name, hp);
    this.#setFactions();
  }

  updateMaxHp(name: string, maxHp: number): void {
    if (GameController.isInvalidHp(maxHp)) {
      return;
    }

    this.runtimeState.updateMaxHp(name, maxHp);
    this.#setFactions();
  }

  updateHomeworld(name: string, homeworld: string) {
    // allow homeworld to be set to ""
    this.runtimeState.updateHomeworld(name, homeworld);
    this.#setFactions();
  }

  updateTag(name: string, tag: string): void {
    // allow tag to be set to ""
    this.runtimeState.updateTag(name, tag);
    this.#setFactions();
  }

  addAsset(selectedFaction: string, assetName: string): void {
    this.runtimeState.addAsset(selectedFaction, assetName);
    this.#setAssets();
  }

  removeAsset(selectedFaction: string, selectedAsset: string, assetId: number): void {
    console.debug(`GameController.removeAsset(${selectedFaction}, ${selectedAsset}, ${assetId})`);
    this.runtimeState.removeAsset(selectedFaction, selectedAsset, assetId);
    this.#setAssets();
  }

}
