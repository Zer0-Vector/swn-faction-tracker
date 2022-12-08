import { DraggableLocation } from "react-beautiful-dnd";

import { action } from "@storybook/addon-actions";

import { IGameController } from "../../controllers/GameController";
import FactionInfo from "../../types/FactionInfo";
import GoalInfo from "../../types/GoalInfo";
import LocationInfo from "../../types/LocationInfo";
import { Maybe } from "../../types/Maybe";
import PurchasedAsset from "../../types/PurchasedAsset";

export const MockActionController: IGameController = {
  setGoal(faction: string, goal: GoalInfo): void {
    action(this.setGoal.name)(faction, goal);
  },
  reorderLocations(source: DraggableLocation, destination?: DraggableLocation | undefined): void {
    action(this.reorderLocations.name)(source, destination);
  },
  updateLocationName(curr: string, val: string): Maybe<LocationInfo> {
    action(this.updateLocationName.name)(curr, val);
    return {} as LocationInfo;
  },
  removeLocation(selectedLocation: string): void {
    action(this.removeLocation.name)(selectedLocation);
  },
  addLocation(info: LocationInfo): void {
    action(this.addLocation.name)(info);
  },
  removeAsset(selectedFaction: string, assetRef: string): void {
    action(this.removeAsset.name)(selectedFaction, assetRef);
  },
  addAsset(selectedFaction: string, assetName: string): PurchasedAsset {
    action(this.addAsset.name)(selectedFaction, assetName);
    return {} as PurchasedAsset;
  },
  updateTag(name: string, tag: string): void {
    action(this.updateTag.name)(name, tag);
  },
  reorderFactions(sourceIndex: number, destinationIndex: number): void {
    action(this.reorderFactions.name)(sourceIndex, destinationIndex);
  },
  addFaction(name: string): FactionInfo {
    action(this.addFaction.name)(name);
    return {} as FactionInfo;
  },
  removeFaction(name: string): void {
    action(this.removeFaction.name)(name);
  },
  updateFactionName(currentName: string, newName: string): Maybe<string> {
    action(this.updateFactionName.name)(currentName, newName);
    return undefined;
  },
  updateForce(name: string, force: number): void {
    action(this.updateForce.name)(name, force);
  },
  updateCunning(name: string, cunning: number): void {
    action(this.updateCunning.name)(name, cunning);
  },
  updateWealth(name: string, wealth: number): void {
    action(this.updateWealth.name)(name, wealth);
  },
  updateHp(name: string, hp: number): void {
    action(this.updateHp.name)(name, hp);
  },
  updateMaxHp(name: string, maxHp: number): void {
    action(this.updateMaxHp.name)(name, maxHp);
  },
  updateHomeworld(name: string, homeworld: string): void {
    action(this.updateHomeworld.name)(name, homeworld);
  },
};
