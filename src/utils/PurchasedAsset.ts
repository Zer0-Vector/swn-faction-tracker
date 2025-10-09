import ASSETS, { isAsset } from "../data/Assets";
import { NamedSluggedEntity } from "./NamedElementPoset";
import Nullable from "../types/Nullable";
import { Prettify } from "../types/Prettify";

export default class PurchasedAsset implements NamedSluggedEntity {

  constructor(
    public readonly id: string,
    public slug: string,
    public readonly name: string,
    public readonly factionId: string,
    public hp: Nullable<number>,
    public locationId?: string,
    public nickname?: string,
  ) {}

  static from(info: Prettify<NamedSluggedEntity & { factionId: string }>) {
    if (!isAsset(info.name)) {
      throw new Error(`Unknown asset: "${info.name}"`);
    }
    return new PurchasedAsset(info.id, info.slug, info.name, info.factionId, ASSETS[info.name].maxHp);
  }

}
