import FactionInfo from "./FactionInfo";
import { PurchasedAsset } from "./PurchasedAsset";

export default interface StoredGameState {
  factions: [key: string, value: FactionInfo][];
  factionOrder: string[];
  assets: [key: string, value: PurchasedAsset][];
}
