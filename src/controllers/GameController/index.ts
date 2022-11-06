import React from "react";
import FactionInfo from "../../types/FactionInfo";
import GameState from "../../types/GameState";

export interface IGameController {
  reorderFactions(sourceIndex: number, destinationIndex: number): void;
  addFaction(name: string): void;
  removeFaction(name: string): void;
  updateFactionName(currentName: string, newName: string): void;
  updateForce(name: string, force: number): void;
  updateCunning(name: string, cunning: number): void;
  updateWealth(name: string, wealth: number): void;
  updateHp(name: string, hp: number): void;
  updateMaxHp(name: string, maxHp: number): void;
}

type GameStateSetter = React.Dispatch<React.SetStateAction<GameState>>;

export class GameController implements IGameController {

  private setState: GameStateSetter;

  constructor(setState: GameStateSetter) {
    this.setState = setState;
  }

  static isInvalidStat(val: number) {
    return isNaN(val) || val < 0 || val > 10;
  }

  static isInvalidHp(val: number) {
    return isNaN(val) || val < 0;
  }

  reorderFactions(sourceIndex: number, destinationIndex: number): void {
    console.log("Reordering factions...");
    this.setState((prevState: GameState) => {
      const orderCopy = [ ...prevState.factionOrder ];
      const [removed] = orderCopy.splice(sourceIndex, 1);
      orderCopy.splice(destinationIndex, 0, removed);
      return {
        ...prevState,
        factionOrder: orderCopy,
      };
    });
  }

  addFaction(name: string): void {
    console.log("Adding Faction: " + name);
    if (name.trim().length > 0) {
      this.setState((state: GameState) => {
        let factions = state.factions;
        if (Object.keys(factions).includes(`${name}`)) {
          console.warn("Overwriting faction: ", factions[name]);
        }

        factions = {
          ...factions,
          [name]: new FactionInfo(name),
        };

        const factionOrder: string[] = Array.from(state.factionOrder);
        factionOrder.push(name);

        const assets = {
          ...state.assets,
          [name]: []
        };
        
        return {
          ...state,
          factions,
          factionOrder,
          assets
        };
      });
    }
  }

  removeFaction(name: string): void {
    console.log("Removing faction: " + name);
    this.setState((state: GameState) => {
      const stateCopy = { ...state };
      delete stateCopy.factions[name];
      delete stateCopy.assets[name];
      stateCopy.factionOrder = stateCopy.factionOrder.filter((fname: string) => fname !== name);
      return stateCopy;
    });
  }

  updateFactionName(currentName: string, newName: string): void {
    this.setState((state: GameState) => {
      if (Object.keys(state.factions).includes(newName)) {
        console.warn(`Cannot rename faction '${currentName}' to '${newName}'. Already exists.`);
        return state;
      }

      console.info(`Renaming faction '${currentName}' to '${newName}'`);
      const stateCopy = { ...state };
      const factionCopy = FactionInfo.copy(state.factions[currentName]);
      const assetsCopy = [ ...state.assets[currentName] ];
      factionCopy.name = newName;
      delete stateCopy.factions[currentName];
      delete stateCopy.assets[currentName];
      stateCopy.factions[newName] = factionCopy;
      stateCopy.assets[newName] = assetsCopy;
      stateCopy.factionOrder = stateCopy.factionOrder.map(value => (value === currentName) ? newName : value);
      console.log("new state:", stateCopy);
      return stateCopy;
    });
  }

  updateForce(name: string, force: number): void {
    if (GameController.isInvalidStat(force)) {
      return;
    }
    this.setState((state: GameState) => {
      const factionsCopy = { ...state.factions };
      console.log(`Updating force for ${name}: ${factionsCopy[name].stats.force} to ${force}`);

      const stats = factionsCopy[name].stats;
      factionsCopy[name].stats = {
        ...stats,
        force: force,
      };
      FactionInfo.recomputeMaxHp(factionsCopy[name]);
      return {
        ...state,
        factions: factionsCopy
      };
    });
  }
  updateCunning(name: string, cunning: number): void {
    if (GameController.isInvalidStat(cunning)) {
      return;
    }

    this.setState((state: GameState) => {
      const factionsCopy = { ...state.factions };
      console.log(`Updating cunning for ${name}: ${factionsCopy[name].stats.cunning} to ${cunning}`);

      const stats = factionsCopy[name].stats;
      factionsCopy[name].stats = {
        ...stats,
        cunning: cunning,
      };
      FactionInfo.recomputeMaxHp(factionsCopy[name]);
      return {
        ...state,
        factions: factionsCopy
      };
    });
  }
  updateWealth(name: string, wealth: number): void {
    if (GameController.isInvalidStat(wealth)) {
      return;
    }

    this.setState((state: GameState) => {
      const factionsCopy = { ...state.factions };
      console.log(`Updating wealth for ${name}: ${factionsCopy[name].stats.wealth} to ${wealth}`);
      
      const stats = factionsCopy[name].stats;
      factionsCopy[name].stats = {
        ...stats,
        wealth: wealth,
      };
      FactionInfo.recomputeMaxHp(factionsCopy[name]);
      return {
        ...state,
        factions: factionsCopy
      };
    });
  }
  updateHp(name: string, hp: number): void {
    if (GameController.isInvalidHp(hp)) {
      return;
    }

    this.setState((state: GameState) => {
      const factionsCopy = { ...state.factions };
      console.log(`Updating hp for ${name}: ${factionsCopy[name].stats.hp} to ${hp}`);
      
      const stats = factionsCopy[name].stats;
      factionsCopy[name].stats = {
        ...stats,
        hp: hp,
      };
      return {
        ...state,
        factions: factionsCopy
      };
    });
  }
  updateMaxHp(name: string, maxHp: number): void {
    if (GameController.isInvalidHp(maxHp)) {
      return;
    }

    this.setState((state: GameState) => {
      const factionsCopy = { ...state.factions };
      console.log(`Updating maxHp for ${name}: ${factionsCopy[name].stats.maxHp} to ${maxHp}`);
      
      const stats = factionsCopy[name].stats;
      factionsCopy[name].stats = {
        ...stats,
        maxHp: maxHp,
      };
      return {
        ...state,
        factions: factionsCopy
      };
    });
  }

}
