import AssetId from "./AssetId";

export default interface PurchasedAsset {
  id: AssetId;
  hp: number;
  nickname?: string;
  location?: string;
}

export class PurchasedAssetUtils {

  static getKey(factionName: string, pa: PurchasedAsset): string {
    return `${factionName}.${AssetId.toRefFormat(pa.id)}`;
  }

}
