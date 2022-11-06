import FactionInfo from "./FactionInfo";
import PurchasedAsset from "./PurchasedAsset";

interface GameState {
  isLoading: boolean;
  factions: { [id: string]: FactionInfo };
  factionOrder: string[];
  assets: { [factionId: string]: PurchasedAsset[] }
}

export default GameState;
