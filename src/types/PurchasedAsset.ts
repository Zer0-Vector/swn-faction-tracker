import Nullable from "./Nullable";

export default class PurchasedAsset {
  
  constructor(
    public readonly id: string,
    public slug: string,
    public readonly name: string,
    public readonly factionId: string,
    public hp: Nullable<number>,
    public nickname?: string,
    public locationId?: string
  ) {}

}
