import { IGameController } from "../controllers/GameController";
import ASSETS from "../data/Assets";
import NamedCounter from "../utils/NamedCounter";
import FactionInfo from "./FactionInfo";
import { PurchasedAsset } from "./PurchasedAsset";
import StoredGameState from "./StoredGameState";

interface IGameState {
  getAssets(factionName: string | null): PurchasedAsset[]
}

export default class RuntimeGameState implements IGameController, IGameState {
  
  factions: Map<string, FactionInfo>;
  factionOrder: string[];
  assets: Map<string, PurchasedAsset>;

  constructor(storedState: StoredGameState) {
    console.debug(`Init RuntimeGameState: ${storedState.factions.length} factions, ${storedState.assets.length} assets`);
    this.factions = new Map(storedState.factions);
    this.factionOrder = storedState.factionOrder;
    this.assets = new Map(storedState.assets);
    console.debug(`RtGS - ${this.factions.size}F, ${this.assets.size}A`);
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
    this.factions.delete(currentName);
    this.factions.set(newName, faction);

    this.factionOrder.forEach((item, index, array) => {
      if (item === currentName) {
        array[index] = newName;
      }
    });

    this.assets.forEach((value, key, map) => {
      if (key.startsWith(currentName)) {
        map.delete(key);
        map.set(PurchasedAsset.getKey(newName, value), value);
      }
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

  getAssets(factionName: string | null): PurchasedAsset[] {
    if (factionName === null) {
      return [];
    }

    return Array.from(this.assets.entries())
        .filter(entry => entry[0].startsWith(factionName))
        .map(entry => entry[1]);
  }

  addAsset(selectedFaction: string, assetName: string) {
    const id = NamedCounter.increment(`${selectedFaction}.${assetName}`);
    const hp = ASSETS[assetName]?.maxHp || 0;
    const asset = new PurchasedAsset(id, assetName, hp);
    this.assets.set(PurchasedAsset.getKey(selectedFaction, asset), asset);
  }

  removeAsset(selectedFaction: string, selectedAsset: string, assetId: number): void {
    console.debug(`RuntimeGameController.removeAsset(${selectedFaction}, ${selectedAsset}, ${assetId}); ${this.assets.size} assets`);
    if (!this.assets.delete(`${selectedFaction}.${selectedAsset}.${assetId}`)) {
      console.warn("Nothing was deleted!");
    }
    console.debug(`${this.assets.size}`);
  }

}