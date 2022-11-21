import React from "react";
import { DraggableLocation } from "react-beautiful-dnd";

import FactionInfo from "../types/FactionInfo";
import { isGameMode } from "../types/GameMode";
import GoalInfo from "../types/GoalInfo";
import LocationInfo from "../types/LocationInfo";
import PurchasedAsset from "../types/PurchasedAsset";
import RuntimeGameState from "../types/RuntimeGameState";
import StoredGameState from "../types/StoredGameState";

export interface IGameController {
  setGoal(faction: string, goal: GoalInfo): void;
  setMode(value: string): void;
  reorderLocations(source: DraggableLocation, destination?: DraggableLocation): void;
  updateLocationName(curr: string, val: string): void;
  removeLocation(selectedLocation: string): void;
  addLocation(info: LocationInfo): void;
  removeAsset(selectedFaction: string, assetRef: string): void;
  addAsset(selectedFaction: string, assetName: string): PurchasedAsset;
  updateTag(name: string, tag: string): void;
  reorderFactions(sourceIndex: number, destinationIndex: number): void;
  addFaction(name: string): FactionInfo;
  removeFaction(name: string): void;
  updateFactionName(currentName: string, newName: string): void;
  updateForce(name: string, force: number): void;
  updateCunning(name: string, cunning: number): void;
  updateWealth(name: string, wealth: number): void;
  updateHp(name: string, hp: number): void;
  updateMaxHp(name: string, maxHp: number): void;
  updateHomeworld(name: string, homeworld: string): void;
}

export type GameStateSetter = React.Dispatch<React.SetStateAction<StoredGameState>>;

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

  setGoal(faction: string, goal: GoalInfo): void {
    this.runtimeState.setGoal(faction, goal);
    this.#writeFactions();
  }

  setMode(mode: string) {
    if (!isGameMode(mode)) {
      throw new Error(`Invalid GameMode: '${mode}'`);
    }
    this.runtimeState.setMode(mode);
    this.#writeMode();
  }
  
  #writeMode() {
    this.setState(prev => ({
      ...prev,
      mode: this.runtimeState.mode,
    }));
  }

  #writeFactions(setOrder = false) {
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

  #writeFactionOrder() {
    this.setState(prev => ({
      ...prev,
      factionOrder: this.runtimeState.factionOrder
    }));
  }

  #writeAssets() {
    this.setState(prev => ({
      ...prev,
      assets: Array.from(this.runtimeState.assets.entries()),
    }));
  }

  #writeFactionsAndAssets() {
    console.debug("setFactionsAndAssets()");
    this.setState((state: StoredGameState) => {
      return {
        ...state,
        factions: Array.from(this.runtimeState.factions.entries()),
        factionOrder: this.runtimeState.factionOrder,
        assets: Array.from(this.runtimeState.assets.entries()),
      };
    });
  }

  #writeLocations() {
    this.setState(state => ({
      ...state,
      locations: Array.from(this.runtimeState.locations.entries()),
      locationsOrder: this.runtimeState.locationsOrder,
    }));
  }

  #writeLocationDependecies() {
    this.setState(state => ({
      ...state,
      factions: Array.from(this.runtimeState.factions.entries()),
      assets: Array.from(this.runtimeState.assets.entries()),
      locations: Array.from(this.runtimeState.locations.entries()),
    }));
  }

  reorderFactions(sourceIndex: number, destinationIndex: number): void {
    console.log("Reordering factions...");
    this.runtimeState.reorderFactions(sourceIndex, destinationIndex);
    this.#writeFactionOrder();
  }

  addFaction(name: string): FactionInfo {
    if (name.trim().length === 0) {
      throw new Error("Faction name cannot be empty");
    }
    console.log("Adding Faction: " + name);
    const result = this.runtimeState.addFaction(name);
    this.#writeFactions(true);
    return result;
  }

  removeFaction(name: string): void {
    console.log("Removing faction: " + name);
    this.runtimeState.removeFaction(name);
    this.#writeFactionsAndAssets();
  }

  updateFactionName(currentName: string, newName: string): void {
    console.debug("GameController.updateFactionName");
    this.runtimeState.updateFactionName(currentName, newName);
    this.#writeFactionsAndAssets();
  }

  updateForce(name: string, force: number): void {
    if (GameController.isInvalidStat(force)) {
      return;
    }
    this.runtimeState.updateForce(name, force);
    this.#writeFactions();
  }

  updateCunning(name: string, cunning: number): void {
    if (GameController.isInvalidStat(cunning)) {
      return;
    }

    this.runtimeState.updateCunning(name, cunning);
    this.#writeFactions();
  }

  updateWealth(name: string, wealth: number): void {
    if (GameController.isInvalidStat(wealth)) {
      return;
    }

    this.runtimeState.updateWealth(name, wealth);
    this.#writeFactions();
  }

  updateHp(name: string, hp: number): void {
    if (GameController.isInvalidHp(hp)) {
      return;
    }

    this.runtimeState.updateHp(name, hp);
    this.#writeFactions();
  }

  updateMaxHp(name: string, maxHp: number): void {
    if (GameController.isInvalidHp(maxHp)) {
      return;
    }

    this.runtimeState.updateMaxHp(name, maxHp);
    this.#writeFactions();
  }

  updateHomeworld(name: string, homeworld: string) {
    // allow homeworld to be set to ""
    this.runtimeState.updateHomeworld(name, homeworld);
    this.#writeFactions();
  }

  updateTag(name: string, tag: string): void {
    // allow tag to be set to ""
    this.runtimeState.updateTag(name, tag);
    this.#writeFactions();
  }

  addAsset(selectedFaction: string, assetName: string): PurchasedAsset {
    const result = this.runtimeState.addAsset(selectedFaction, assetName);
    this.#writeAssets();
    return result;
  }

  removeAsset(selectedFaction: string, assetRef: string): void {
    console.debug(`GameController.removeAsset(${selectedFaction}, ${assetRef})`);
    this.runtimeState.removeAsset(selectedFaction, assetRef);
    this.#writeAssets();
  }

  addLocation(info: LocationInfo): void {
    console.debug("Adding location:", info);
    this.runtimeState.addLocation(info);
    this.#writeLocations();
  }

  removeLocation(selectedLocation: string): void {
    console.debug("Removing location:", selectedLocation);
    this.runtimeState.removeLocation(selectedLocation);
    this.#writeLocations();
  }

  updateLocationName(curr: string, val: string): void {
    console.debug(`Renaming location '${curr}' to '${val}'`);
    this.runtimeState.updateLocationName(curr, val);
    this.#writeLocationDependecies();
  }

  reorderLocations(source: DraggableLocation, destination?: DraggableLocation): void {
    if (destination) {
      console.debug(`Reordering locations: ${source.index} -> ${destination.index}`);
      this.runtimeState.reorderLocations(source, destination);
      this.#writeLocations();
    }
  }

}
