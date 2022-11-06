export default interface PurchasedAsset {
  id: number;
  name: string;
  hp: number;
  nickname?: string;
  location?: string;
}

export class PurchasedAssetUtils {

  static getKey(factionName: string, pa: PurchasedAsset): string {
    return `${factionName}.${pa.name}.${pa.id}`;
  }

}
