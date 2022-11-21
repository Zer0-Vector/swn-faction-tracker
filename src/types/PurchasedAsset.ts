import AssetId from "./AssetId";

export default class PurchasedAsset {
  
  constructor(
    public readonly id: AssetId,
    public hp: number,
    public nickname?: string,
    public location?: string
  ) {}

  static getKey(factionName: string, pa: PurchasedAsset): string {
    return `${factionName}.${AssetId.toRefFormat(pa.id)}`;
  }

}
