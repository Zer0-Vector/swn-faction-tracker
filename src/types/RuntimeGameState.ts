import { DraggableLocation } from "react-beautiful-dnd";

import { IGameController } from "../controllers/GameController";
import ASSETS from "../data/Assets";
import { generateId } from "../utils/IdGenerator";

import AssetId from "./AssetId";
import FactionInfo from "./FactionInfo";
import { FactionStat } from "./FactionStatsInfo";
import GameMode, { isGameMode } from "./GameMode";
import GoalInfo from "./GoalInfo";
import LocationInfo from "./LocationInfo";
import { Maybe } from "./Maybe";
import PurchasedAsset, { PurchasedAssetUtils } from "./PurchasedAsset";
import StoredGameState from "./StoredGameState";

export interface IGameState {
  mode: GameMode;
  getFactions(): FactionInfo[];
  getFaction(factionId: string): FactionInfo | undefined;
  getAssets(factionId: Maybe<string>): PurchasedAsset[];
  getAsset(factionId: string, assetId: string): PurchasedAsset | undefined;
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

  setGoal(factionId: string, goal: GoalInfo): void {
    const faction = this.factions.get(factionId);
    if (faction) {
      faction.goal = goal;
      this.factions.set(factionId, faction); // FIXME I think this is redundant
    }
  }

  setMode(mode: string) {
    if (!isGameMode(mode)) {
      throw new Error(`Unknown GameMode: '${mode}'`);
    }
    this.mode = mode;
  }

  updateTag(factionId: string, tag: string): void {
    const faction = this.factions.get(factionId);
    if (faction) {
      faction.tag = tag;
      this.factions.set(factionId, faction); // FIXME I think this is redundant
    }
  }

  reorderFactions(sourceIndex: number, destinationIndex: number): void {
    const [removed] = this.factionOrder.splice(sourceIndex, 1);
    this.factionOrder.splice(destinationIndex, 0, removed);
  }

  addFaction(name: string): void {
    const currentIds = Array.from(this.factions.keys());
    const id = generateId(name, currentIds);

    // indicates bug in id generation
    if (currentIds.includes(id)) {
      throw new Error(`duplicate faction id: "${id}"`);
    }

    // indicates bug in form validation
    for (const val of this.factions.values()) {
      if (val.name === name) {
        throw new Error(`Duplicat faction name: "${name}"`);
      }
    }

    this.factions.set(id, new FactionInfo(id, name));
    this.factionOrder.push(id);
    console.info("Added faction:", id);
  }

  removeFaction(factionId: string): void {
    this.factions.delete(factionId);
    this.factionOrder = this.factionOrder.filter(item => item !== factionId);
    console.info("Deleting faction:", factionId);
    this.assets.forEach((_asset, key, map) => {
      if (key.startsWith(factionId)) {
        map.delete(key);
        console.info("Deleting asset:", key);
      }
    });
  }

  updateFactionName(currentFactionId: string, newFactionName: string): void {
    const faction = this.factions.get(currentFactionId);
    if (!faction) {
      return;
    }
    const currentIds = Array.from(this.factions.keys()).filter(val => val !== currentFactionId);
    const newFactionId = generateId(newFactionName, currentIds);
    if (currentIds.includes(newFactionId)) {
      throw new Error(`Duplicate faction id detected: ${newFactionId}`);
    }

    faction.id = newFactionId;
    faction.name = newFactionName;
    this.factions.delete(currentFactionId);
    this.factions.set(newFactionId, faction);

    this.factionOrder.forEach((item, index) => {
      if (item === currentFactionId) {
        this.factionOrder[index] = newFactionId;
      }
    });

    const keysToChange = Array.from(this.assets.keys()).filter(key => key.startsWith(currentFactionId));
    keysToChange.forEach(key => {
      const asset = this.assets.get(key);
      if (asset) {
        this.assets.set(PurchasedAssetUtils.getKey(newFactionId, asset), asset);
      } else {
        console.warn("Found undefined mapping for ", key);
      }
      this.assets.delete(key);
    });
    console.info(`Renamed ${faction.name} (${currentFactionId}) to ${newFactionName} (${newFactionId})`);
  }

  #updateStat(factionId: string, statName: FactionStat, value: number) {
    const faction = this.factions.get(factionId);
    if (faction) {
      faction.stats[statName] = value;
      FactionInfo.recomputeMaxHp(faction);
      this.factions.set(factionId, faction);
      console.info(`${statName} set for ${factionId}:`, value);
    } else {
      console.warn("Unknown faction id: ", factionId);
    }
  }

  updateForce(factionId: string, force: number): void {
    this.#updateStat(factionId, "force", force);
  }

  updateCunning(factionId: string, cunning: number): void {
    this.#updateStat(factionId, "cunning", cunning);
  }

  updateWealth(factionId: string, wealth: number): void {
    this.#updateStat(factionId, "wealth", wealth);
  }

  updateHp(factionId: string, hp: number): void {
    const faction = this.factions.get(factionId);
    if (faction) {
      faction.stats.hp = hp;
      this.factions.set(factionId, faction);
      console.info(`HP set for ${factionId}:`, hp);
    } else {
      console.warn("Unknown faction id: ", factionId);
    }
  }

  updateMaxHp(factionId: string, maxHp: number): void {
    const faction = this.factions.get(factionId);
    if (faction) {
      faction.stats.maxHp = maxHp;
      this.factions.set(factionId, faction);
      console.info(`MaxHp set for ${factionId}:`, maxHp);
    } else {
      console.warn("Unknown faction id: ", factionId);
    }
  }

  updateHomeworld(factionId: string, homeworld: string): void {
    const faction = this.factions.get(factionId);
    if (faction) {
      faction.homeworld = homeworld;
      this.factions.set(factionId, faction);
      console.info(`Homeworld set for ${faction?.name} (${factionId}):`, homeworld);
    } else {
      console.warn("Unknown faction id: ", factionId);
    }
  }

  getAssets(factionId: Maybe<string>): PurchasedAsset[] {
    if (factionId === undefined) {
      // FIXME reenable once faction list clears uiState.selectedFaction after animation completes
      // console.warn("Requesting assets for null faction");
      return [];
    }

    return Array.from(this.assets.entries())
        .filter(entry => entry[0].startsWith(factionId))
        .map(entry => entry[1]);
  }

  getAsset(factionId: string, assetRef: string): PurchasedAsset | undefined {
      const fqAssetId = `${factionId}.${assetRef}`;
      return this.assets.get(fqAssetId);
  }

  #nextAssetIndex(prefix: string): number {
    const currentIds = Array.from(this.assets.keys())
      .filter(item => item.startsWith(prefix))
      .map(item => parseInt(item.split(/[.-]/)[2]));
    if (currentIds.length === 0) {
      return 1;
    } else {
      const maxId = Math.max(...currentIds);
      return maxId + 1;
    }
  }

  addAsset(selectedFactionId: string, assetName: string) {
    const index = this.#nextAssetIndex(`${selectedFactionId}.${AssetId.toRefName(assetName)}`);
    const id: AssetId = new AssetId(assetName, index);
    const hp = ASSETS[assetName]?.maxHp || 0;
    const asset: PurchasedAsset = { id, hp };
    this.assets.set(PurchasedAssetUtils.getKey(selectedFactionId, asset), asset);
    console.info(`Added asset (${assetName}): ${AssetId.toRefFormat(id)}`);
  }

  removeAsset(selectedFactionId: string, assetRef: string): void {
    const fqAssetId = `${selectedFactionId}.${assetRef}`;
    if (!this.assets.delete(fqAssetId)) {
      console.warn("No assets were deleted: ", fqAssetId);
    }
  }

  getFactions(): FactionInfo[] {
    return this.factionOrder.map(factionId => this.factions.get(factionId)) as FactionInfo[];
  }

  getFaction(factionId: string): FactionInfo | undefined {
    return this.factions.get(factionId);
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
        this.factions.set(faction.id, {
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
