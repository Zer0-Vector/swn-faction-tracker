import FactionInfo from "./FactionInfo";

export default interface GameState {
  isLoading: boolean;
  factions: { [id: string]: FactionInfo };
}
