import { DraggableLocation } from "react-beautiful-dnd";

import { IGameController } from "../controllers/GameController";
import ASSETS from "../data/Assets";

import FactionInfo from "./FactionInfo";
import GameMode, { isGameMode } from "./GameMode";
import GoalInfo from "./GoalInfo";
import LocationInfo from "./LocationInfo";
import Nullable from "./Nullable";
import PurchasedAsset, { PurchasedAssetUtils } from "./PurchasedAsset";
import StoredGameState from "./StoredGameState";

export interface IGameState {
  mode: GameMode;
  getFactions(): FactionInfo[];
  getFaction(factionName: string): FactionInfo | undefined;
  getAssets(factionName: Nullable<string>): PurchasedAsset[];
  getLocations(): LocationInfo[];
  getLocation(locationName: string): LocationInfo | undefined;
}

export default class RuntimeGameState implements IGameController, IGameState {

  factions: Map<string, FactionInfo>;
  factionOrder: string[];
  assets: Map<string, PurchasedAsset>;
  locations: Map<string, LocationInfo>;
  locationsOrder: string[];
  mode: GameMode;

  constructor(storedState: StoredGameState) {
    console.debug(`Init RuntimeGameState: ${storedState.factions.length} factions, ${storedState.assets.length} assets`);
    this.factions = new Map(storedState.factions);
    this.factionOrder = storedState.factionOrder;
    this.assets = new Map(storedState.assets);
    this.locations = new Map(storedState.locations);
    this.locationsOrder = storedState.locationsOrder;
    this.mode = storedState.mode;
    console.debug(`RtGS - ${this.factions.size}F, ${this.assets.size}A, ${this.locations.size}L`);
  }

  setGoal(factionName: string, goal: GoalInfo): void {
    const faction = this.factions.get(factionName);
    if (faction) {
      faction.goal = goal;
      this.factions.set(factionName, faction);
    }
  }

  setMode(mode: string) {
    if (!isGameMode(mode)) {
      throw new Error(`Unknown GameMode: '${mode}'`);
    }
    this.mode = mode;
  }

  updateTag(name: string, tag: string): void {
    const faction = this.factions.get(name);
    if (faction) {
      faction.tag = tag;
      this.factions.set(name, faction);
    }
  }

  reorderFactions(sourceIndex: number, destinationIndex: number): void {
    const [removed] = this.factionOrder.splice(sourceIndex, 1);
    this.factionOrder.splice(destinationIndex, 0, removed);
  }

  addFaction(name: string): void {
    this.factions.set(name, new FactionInfo(name));
    this.factionOrder.push(name);
  }

  removeFaction(name: string): void {
    this.factions.delete(name);
    this.factionOrder = this.factionOrder.filter(item => item !== name);
    this.assets.forEach((_, key, map) => {
      if (key.startsWith(name)) {
        map.delete(key);
      }
    });
  }

  updateFactionName(currentName: string, newName: string): void {
    const faction = this.factions.get(currentName);
    if (!faction) {
      return;
    }
    faction.name = newName;
    console.debug("RuntimeGameState: Updating faction map");
    this.factions.delete(currentName);
    this.factions.set(newName, faction);

    console.debug("RuntimeGameState: Updating factionOrder");
    this.factionOrder.forEach((item, index) => {
      if (item === currentName) {
        this.factionOrder[index] = newName;
      }
    });

    console.debug("RuntimeGameState: Updating assets map");
    const keysToChange = Array.from(this.assets.keys()).filter(key => key.startsWith(currentName));
    keysToChange.forEach(key => {
      const asset = this.assets.get(key);
      if (asset) {
        this.assets.set(PurchasedAssetUtils.getKey(newName, asset), asset);
      } else {
        console.warn("Found undefined mapping for ", key);
      }
      this.assets.delete(key);
    });
  }

  #updateStat(factionName: string, statName: string, value: number) {
    const faction = this.factions.get(factionName);
    if (faction) {
      faction.stats[statName] = value;
      FactionInfo.recomputeMaxHp(faction);
      this.factions.set(factionName, faction);
    }
  }

  updateForce(name: string, force: number): void {
    this.#updateStat(name, "force", force);
  }

  updateCunning(name: string, cunning: number): void {
    this.#updateStat(name, "cunning", cunning);
  }

  updateWealth(name: string, wealth: number): void {
    this.#updateStat(name, "wealth", wealth);
  }

  updateHp(name: string, hp: number): void {
    const faction = this.factions.get(name);
    if (faction) {
      faction.stats.hp = hp;
      this.factions.set(name, faction);
    }
  }

  updateMaxHp(name: string, maxHp: number): void {
    const faction = this.factions.get(name);
    if (faction) {
      faction.stats.maxHp = maxHp;
      this.factions.set(name, faction);
    }
  }

  updateHomeworld(name: string, homeworld: string): void {
    const faction = this.factions.get(name);
    if (faction) {
      faction.homeworld = homeworld;
      this.factions.set(name, faction);
    }
  }

  getAssets(factionName: Nullable<string>): PurchasedAsset[] {
    if (factionName === null) {
      return [];
    }

    return Array.from(this.assets.entries())
        .filter(entry => entry[0].startsWith(factionName))
        .map(entry => entry[1]);
  }

  #nextId(prefix: string): number {
    const currentIds = Array.from(this.assets.keys())
      .filter(item => item.startsWith(prefix))
      .map(item => parseInt(item.split(".")[2]));
    if (currentIds.length === 0) {
      return 1;
    } else {
      const maxId = currentIds
          .reduce((prev, curr) => Math.max(prev, curr));
      return maxId + 1;
    }
  }

  addAsset(selectedFaction: string, assetName: string) {
    const id = this.#nextId(`${selectedFaction}.${assetName}`);
    const hp = ASSETS[assetName]?.maxHp || 0;
    const asset: PurchasedAsset = { id, name: assetName, hp };
    this.assets.set(PurchasedAssetUtils.getKey(selectedFaction, asset), asset);
  }

  removeAsset(selectedFaction: string, selectedAsset: string, assetId: number): void {
    console.debug(`RuntimeGameController.removeAsset(${selectedFaction}, ${selectedAsset}, ${assetId}); ${this.assets.size} assets`);
    if (!this.assets.delete(`${selectedFaction}.${selectedAsset}.${assetId}`)) {
      console.warn("Nothing was deleted!");
    }
    console.debug(`${this.assets.size}`);
  }

  getFactions(): FactionInfo[] {
    return this.factionOrder.map(name => this.factions.get(name)) as FactionInfo[];
  }

  getFaction(factionName: string): FactionInfo | undefined {
    return this.factions.get(factionName);
  }

  getLocations(): LocationInfo[] {
    return this.locationsOrder.map(name => this.locations.get(name)).filter(loc => loc !== undefined) as LocationInfo[];
  }

  removeLocation(selectedLocation: string) {
    this.locations.delete(selectedLocation);
    this.locationsOrder = this.locationsOrder.filter(loc => loc !== selectedLocation);
  }

  addLocation(info: LocationInfo) {
    this.locations.set(info.name, info);
    this.locationsOrder.push(info.name);
  }

  updateLocationName(curr: string, val: string) {
    for (const loc of this.locations.values()) {
      if (loc.name === curr) {
        this.locations.delete(curr);
        this.locations.set(val, {
          ...loc,
          name: val
        });
        break;
      }
    }

    this.locationsOrder.forEach((loc, index) => {
      if (loc === curr) {
        this.locationsOrder[index] = val;
      }
    });

    for (const faction of this.factions.values()) {
      if (faction.homeworld === curr) {
        this.factions.set(faction.name, {
          ...faction,
          homeworld: val,
        });
      }
    }

    for (const entry of this.assets.entries()) {
      if (entry[1].location === curr) {
        this.assets.set(entry[0], {
          ...entry[1],
          location: val,
        });
      }
    }
  }

  reorderLocations(source: DraggableLocation, destination?: DraggableLocation): void {
    if (!destination) {
      return;
    }
    
    const [removed] = this.locationsOrder.splice(source.index, 1);
    this.locationsOrder.splice(destination.index, 0, removed);
  }

  getLocation(locationName: string): LocationInfo | undefined {
    return this.locations.get(locationName);
  }

}
