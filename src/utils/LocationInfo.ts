import LocationStatsInfo from "../types/LocationStatsInfo";
import { NamedSluggedEntity } from "./NamedElementPoset";



export default class LocationInfo implements NamedSluggedEntity, LocationStatsInfo {
  constructor(
    public readonly id: string,
    public slug: string,
    public name: string,
    public tl: number,
    public x: number,
    public y: number
  ) {}

  static from(info: LocationInfo): LocationInfo {
    return new LocationInfo(info.id, info.slug, info.name,
      info.tl, info.x, info.y);
  }

}
