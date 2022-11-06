import FactionInfo from "./FactionInfo";

interface GameState {
  isLoading: boolean;
  factions: { [id: string]: FactionInfo };
}

export default GameState;
