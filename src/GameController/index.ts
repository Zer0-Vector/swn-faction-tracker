import React from "react";
import FactionInfo from "../types/FactionInfo";
import GameState from "../types/GameState";

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

export class GameController implements IGameController {

  private setState: React.Dispatch<React.SetStateAction<GameState>>;
  private nextRank: number;

  constructor(setState: React.Dispatch<React.SetStateAction<GameState>>) {
    this.setState = setState;
    this.nextRank = 0;
  }
  
  private refreshRanks(factions: FactionInfo[]): {[name: string]: FactionInfo} {
    const sorted = factions.sort((a, b) => a.rank - b.rank);
    let i = 0;
    for (; i < sorted.length; i++) {
      sorted[i].rank = i;
    }
    this.nextRank = i;
    let result = {};
    sorted.forEach(f => {
      result = {
        ...result,
        [f.name]: f
      };
    });
    return result;
  }
  
  private isInvalidStat(val: number) {
    return isNaN(val) || val < 0;
  }

  reorderFactions(sourceIndex: number, destinationIndex: number): void {
    console.log("Reordering factions...");
    this.setState((prevState: GameState) => {
      const factionsCopy = { ...prevState.factions };
      const sourceName = Object.values(factionsCopy).filter(f => f.rank === sourceIndex).at(0)?.name;
      const destinationName = Object.values(factionsCopy).filter(f => f.rank === destinationIndex).at(0)?.name;
      if (!sourceName || !destinationName) {
        console.error("Could not find source or destination: ", sourceName, destinationName);
        return prevState;
      }

      factionsCopy[sourceName].rank = destinationIndex;
      factionsCopy[destinationName].rank = sourceIndex;

      return {
        ...prevState,
        factions: factionsCopy,
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
          [name]: new FactionInfo(name, this.nextRank++),
        };
        
        return {
          ...state,
          factions: factions,
        };
      });
    }
  }

  removeFaction(name: string): void {
    console.log("Removing faction: " + name);
    this.setState((state: GameState) => {
      const stateCopy = { ...state };
      delete stateCopy.factions[name];
      const factions = this.refreshRanks(Object.values(state.factions));
      return { ...stateCopy, factions };
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
      factionCopy.name = newName;
      delete stateCopy.factions[currentName];
      stateCopy.factions[newName] = factionCopy;
      console.log("new state:", stateCopy);
      return stateCopy;
    });
  }

  updateForce(name: string, force: number): void {
    if (this.isInvalidStat(force)) {
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
    if (this.isInvalidStat(cunning)) {
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
    if (this.isInvalidStat(wealth)) {
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
    if (this.isInvalidStat(hp)) {
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
    if (this.isInvalidStat(maxHp)) {
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
