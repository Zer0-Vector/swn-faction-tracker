import { DraggableLocation } from "react-beautiful-dnd";

import { IGameController } from "../controllers/GameController";
import ASSETS, { isAsset } from "../data/Assets";
import { generateSlug } from "../utils/SlugGenerator";

import AssetId from "./AssetId";
import FactionInfo from "./FactionInfo";
import { FactionStat } from "./FactionStatsInfo";
import GoalInfo from "./GoalInfo";
import LocationInfo from "./LocationInfo";
import { Maybe } from "./Maybe";
import PurchasedAsset from "./PurchasedAsset";
import StoredGameState from "./StoredGameState";

export interface IGameState {
  /**
   * @returns The list of factions in order.
   */
  getFactions: () => FactionInfo[];

  /**
   * @param factionId The faction id.
   * @returns The requested `FactionInfo`, or `undefined` if no faction matches the given id.
   */
  getFaction: (factionId: string) => Maybe<FactionInfo>;
  getAssets: (factionId: Maybe<string>) => PurchasedAsset[];
  getAsset: (factionId: string, assetId: string) => Maybe<PurchasedAsset>;
  getLocations: () => LocationInfo[];
  getLocation: (locationId: string) => Maybe<LocationInfo>;

  /**
   * @param factionName The potential faction name.
   * @returns `true` if there are no conflicts, `false` if the name would produce a duplicate faction id.
   */
  checkFactionName: (factionName: string) => boolean;

  /**
   * @param locationName The potential location name.
   * @returns `true` if there are no conflicts, `false` if the name would produce a duplicate location id.
   */
  checkLocationName: (locationName: string) => boolean;
}

export default class RuntimeGameState implements IGameController, IGameState {

  factions: Map<string, FactionInfo>;
  factionOrder: string[];
  assets: Map<string, PurchasedAsset>;
  locations: Map<string, LocationInfo>;
  locationsOrder: string[];

  constructor(storedState: StoredGameState) {
    console.debug(`Init RuntimeGameState: ${storedState.factions.length} factions, ${storedState.assets.length} assets`);
    this.factions = new Map(storedState.factions);
    this.factionOrder = [...storedState.factionOrder];
    this.assets = new Map(storedState.assets);
    this.locations = new Map(storedState.locations);
    this.locationsOrder = [...storedState.locationsOrder];
    console.debug(`RtGS - ${this.factions.size}F, ${this.assets.size}A, ${this.locations.size}L`);
  }

  setGoal(factionId: string, goal: GoalInfo): void {
    const faction = this.factions.get(factionId);
    if (faction) {
      faction.goal = goal;
    }
  }

  updateTag(factionId: string, tag: string): void {
    const faction = this.factions.get(factionId);
    if (faction) {
      faction.tag = tag;
    }
  }

  reorderFactions(sourceIndex: number, destinationIndex: number): void {
    const [removed] = this.factionOrder.splice(sourceIndex, 1);
    this.factionOrder.splice(destinationIndex, 0, removed);
  }

  /**
   * Adds a faction, if name is unique.
   * 
   * @param name the faction name
   * @returns `FactionInfo` for created faction
   * @throws `Error`, if name produces duplicate faction id
   */
  addFaction(name: string): FactionInfo {
    const id = generateSlug(name);

    // indicates duplicate name
    if (this.factions.has(id)) {
      throw new Error(`Conflicing faction name: "${name}" (${id})`);
    }

    const result = new FactionInfo(id, name);
    this.factions.set(id, result);
    this.factionOrder.push(id);
    console.info("Added faction:", id);
    return result;
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

  updateFactionName(currentFactionId: string, newFactionName: string): Maybe<string> {
    const faction = this.factions.get(currentFactionId);
    if (!faction) {
      return undefined;
    }

    const newFactionId = generateSlug(newFactionName);
    if (newFactionId === currentFactionId) {
      return undefined;
    }
    if (this.factions.has(newFactionId)) {
      throw new Error(`Duplicate faction id detected: ${newFactionId}`);
    }

    faction.slug = newFactionId;
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
        this.assets.set(PurchasedAsset.getKey(newFactionId, asset), asset);
      } else {
        console.warn("Found undefined mapping for ", key);
      }
      this.assets.delete(key);
    });
    console.info(`Renamed ${faction.name} (${currentFactionId}) to ${newFactionName} (${newFactionId})`);
    return newFactionId;
  }

  #updateStat(factionId: string, statName: FactionStat, value: number) {
    const faction = this.factions.get(factionId);
    if (faction) {
      faction[statName] = value;
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
      faction.hp = hp;
      this.factions.set(factionId, faction);
      console.info(`HP set for ${factionId}:`, hp);
    } else {
      console.warn("Unknown faction id: ", factionId);
    }
  }

  updateMaxHp(factionId: string, maxHp: number): void {
    const faction = this.factions.get(factionId);
    if (faction) {
      faction.maxHp = maxHp;
      this.factions.set(factionId, faction);
      console.info(`MaxHp set for ${factionId}:`, maxHp);
    } else {
      console.warn("Unknown faction id: ", factionId);
    }
  }

  updateHomeworld(factionId: string, homeworld: string): void {
    const faction = this.factions.get(factionId);
    const location = Array.from(this.locations.values()).find(loc => loc.name === homeworld);
    if (location === undefined) {
      console.warn(`Unknown location, "${homeworld}"`);
      // if the location doesn't exist, do nothing.
      return;
    }

    if (faction) {
      faction.homeworldId = location.slug;
      this.factions.set(factionId, faction);
      console.info(`Homeworld set for ${faction?.name} (${factionId}):`, location);
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

  getAsset(factionId: string, assetRef: string): Maybe<PurchasedAsset> {
      const fqAssetId = `${factionId}.${assetRef}`;
      return this.assets.get(fqAssetId);
  }

  nextAssetIndex(prefix: string): number {
    const currentIds = Array.from(this.assets.keys())
      .filter(item => item.startsWith(prefix))
      .map(item => item.match(`${prefix}-(\\d+)`)?.at(1) || "0")
      .map(item => parseInt(item))
      .filter(item => item > 0);
    if (currentIds.length === 0) {
      return 1;
    } else {
      const maxId = Math.max(...currentIds);
      if (isNaN(maxId)) {
        console.error("Something went wrong finding nextAssetIndex: ", currentIds);
      }
      return maxId + 1;
    }
  }

  addAsset(selectedFactionId: string, assetName: string): PurchasedAsset {
    const index = this.nextAssetIndex(`${selectedFactionId}.${AssetId.toRefName(assetName)}`);
    const id: AssetId = new AssetId(assetName, index);
    const hp = (isAsset(assetName) && ASSETS[assetName]?.maxHp) || 0;
    const asset: PurchasedAsset = { id, hp };
    this.assets.set(PurchasedAsset.getKey(selectedFactionId, asset), asset);
    console.info(`Added asset (${assetName}): ${AssetId.toRefFormat(id)}`);
    return asset;
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

  getFaction(factionId: string): Maybe<FactionInfo> {
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
    if (this.locations.has(info.slug)) {
      throw new Error(`Conflicting location name: ${info.name} (${info.slug})`);
    }
    this.locations.set(info.slug, info);
    this.locationsOrder.push(info.slug);
  }

  updateLocationName(currId: string, val: string) {
    const oldInfo = this.locations.get(currId);
    if (oldInfo === undefined) {
      return undefined;
    }

    const info = new LocationInfo(val, oldInfo.tl, oldInfo.x, oldInfo.y);
    for (const loc of this.locations.values()) {
      if (loc.slug === oldInfo.slug) {
        this.locations.delete(oldInfo.slug);
        this.locations.set(info.slug, info);
        break;
      }
    }

    this.locationsOrder.forEach((loc, index) => {
      if (loc === currId) {
        this.locationsOrder[index] = info.slug;
      }
    });

    for (const faction of this.factions.values()) {
      if (faction.homeworldId === currId) {
        this.factions.set(faction.slug, {
          ...faction,
          homeworldId: info.slug,
        });
      }
    }

    for (const entry of this.assets.entries()) {
      if (entry[1].locationId === currId) {
        this.assets.set(entry[0], {
          ...entry[1],
          locationId: info.slug,
        });
      }
    }

    return info;
  }

  reorderLocations(source: DraggableLocation, destination?: DraggableLocation): void {
    if (!destination) {
      return;
    }
    
    const [removed] = this.locationsOrder.splice(source.index, 1);
    this.locationsOrder.splice(destination.index, 0, removed);
  }

  getLocation(locationName: string): Maybe<LocationInfo> {
    return this.locations.get(locationName);
  }

  checkFactionName(factionName: string): boolean {
    const id = generateSlug(factionName);
    return id.length > 0 && !this.factions.has(id);
  }

  checkLocationName(locationName: string): boolean {
    const id = generateSlug(locationName);
    return id.length > 0 && !this.locations.has(id);
  }

}
