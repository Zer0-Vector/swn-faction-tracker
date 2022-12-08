import FactionInfo from "./FactionInfo";
import LocationInfo from "./LocationInfo";
import PurchasedAsset from "./PurchasedAsset";

export default interface StoredGameState {
  factions: [key: string, value: FactionInfo][];
  factionOrder: string[];
  assets: [key: string, value: PurchasedAsset][];
  locations: [key: string, value: LocationInfo][];
  locationsOrder: string[];
}
