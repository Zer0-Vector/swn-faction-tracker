import React from "react";
import FactionInfo from "../types/FactionInfo";
import GameState from "../types/GameState";

export interface IGameController {
  addFaction(name: string): void;
  removeFaction(name: string): void;
  updateFactionName(currentName: string, newName: string): void;
  updateForce(name: string, force: number): void;
  updateCunning(name: string, cunning: number): void;
  updateWealth(name: string, wealth: number): void;
  updateHp(name: string, hp: number): void;
  updateMaxHp(name: string, maxHp: number): void;
}

const isInvalidStat = (val: number) => {
  return isNaN(val) || val < 0;
}

export const createController = (setState: React.Dispatch<React.SetStateAction<GameState>>): IGameController => (
  {
    addFaction: (name: string): void => {
      console.log("Adding Faction: " + name)
      if (name.trim().length > 0) {
        setState(state => {
          let factions = state.factions;
          if (Object.keys(factions).includes(`${name}`)) {
            console.warn("Overwriting faction: ", factions[name]);
          }
  
          factions = {
            ...factions,
            [name]: new FactionInfo(name),
          };
          
          return {
            ...state,
            factions: factions,
          };
        });
      }
    },
  
    removeFaction: (name: string): void => {
      console.log("Removing faction: " + name);
      setState(state => {
        const stateCopy = { ...state };
        delete stateCopy.factions[name];
        return stateCopy
      });
    },

    updateFactionName: (currentName: string, newName: string): void => {
      setState(state => {
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
    },
  
    updateForce: (name: string, force: number): void => {
      if (isInvalidStat(force)) {
        return;
      }
      setState(state => {
        const factionsCopy = { ...state.factions }
        console.log(`Updating force for ${name}: ${factionsCopy[name].stats.force} to ${force}`);
  
        const stats = factionsCopy[name].stats;
        factionsCopy[name].stats = {
          ...stats,
          force: force,
        }
        FactionInfo.recomputeMaxHp(factionsCopy[name]);
        return {
          ...state,
          factions: factionsCopy
        };
      });
    },

    updateCunning: (name: string, cunning: number): void => {
      if (isInvalidStat(cunning)) {
        return;
      }

      setState(state => {
        const factionsCopy = { ...state.factions }
        console.log(`Updating cunning for ${name}: ${factionsCopy[name].stats.cunning} to ${cunning}`);
  
        const stats = factionsCopy[name].stats;
        factionsCopy[name].stats = {
          ...stats,
          cunning: cunning,
        }
        FactionInfo.recomputeMaxHp(factionsCopy[name]);
        return {
          ...state,
          factions: factionsCopy
        };
      });
    },
  
    updateWealth: (name: string, wealth: number): void => {
      if (isInvalidStat(wealth)) {
        return;
      }

      setState(state => {
        const factionsCopy = { ...state.factions }
        console.log(`Updating wealth for ${name}: ${factionsCopy[name].stats.wealth} to ${wealth}`);
        
        const stats = factionsCopy[name].stats;
        factionsCopy[name].stats = {
          ...stats,
          wealth: wealth,
        }
        FactionInfo.recomputeMaxHp(factionsCopy[name]);
        return {
          ...state,
          factions: factionsCopy
        };
      });
    },

    updateHp: (name: string, hp: number): void => {
      if (isInvalidStat(hp)) {
        return;
      }

      setState(state => {
        const factionsCopy = { ...state.factions }
        console.log(`Updating hp for ${name}: ${factionsCopy[name].stats.hp} to ${hp}`);
        
        const stats = factionsCopy[name].stats;
        factionsCopy[name].stats = {
          ...stats,
          hp: hp,
        }
        return {
          ...state,
          factions: factionsCopy
        };
      });
    },

    updateMaxHp: (name: string, maxHp: number): void => {
      if (isInvalidStat(maxHp)) {
        return;
      }

      setState(state => {
        const factionsCopy = { ...state.factions }
        console.log(`Updating maxHp for ${name}: ${factionsCopy[name].stats.maxHp} to ${maxHp}`);
        
        const stats = factionsCopy[name].stats;
        factionsCopy[name].stats = {
          ...stats,
          maxHp: maxHp,
        }
        return {
          ...state,
          factions: factionsCopy
        };
      });
    },
  }
);
