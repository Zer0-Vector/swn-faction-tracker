import FactionInfo from "../utils/FactionInfo";
import LocationInfo from "../utils/LocationInfo";
import PurchasedAsset from "../utils/PurchasedAsset";

export default interface StoredGameState {
  factions: [key: string, value: FactionInfo][];
  factionOrder: string[];
  assets: [key: string, value: PurchasedAsset][];
  locations: [key: string, value: LocationInfo][];
  locationsOrder: string[];
}
