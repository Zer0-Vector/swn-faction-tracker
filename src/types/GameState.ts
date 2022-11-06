import FactionInfo from "./FactionInfo";

interface GameState {
  isLoading: boolean;
  factions: { [id: string]: FactionInfo };
  factionOrder: string[];
}

export default GameState;
