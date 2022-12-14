import { generateSlug } from "../utils/SlugGenerator";

export default class LocationInfo {

  slug: string;
  name: string;
  tl: number;
  x: number;
  y: number;

  constructor(name: string, tl: number, x: number, y: number) {
    this.slug = generateSlug(name);
    this.name = name;
    this.tl = tl;
    this.x = x;
    this.y = y;
  }

}
