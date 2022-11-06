import FactionInfo from "./FactionInfo";
import PurchasedAsset from "./PurchasedAsset";

export default interface GameState {
  isLoading: boolean;
  factions: { [id: string]: FactionInfo };
  factionOrder: string[];
  assets: { [factionId: string]: PurchasedAsset[] }
}
