import { v4 as randomUuid } from "uuid";

import { generateSlug } from "../utils/SlugGenerator";

export default class LocationInfo {

  id: string;
  slug: string;
  name: string;
  tl: number;
  x: number;
  y: number;

  constructor(name: string, tl: number, x: number, y: number) {
    this.id = randomUuid();
    this.slug = generateSlug(name);
    this.name = name;
    this.tl = tl;
    this.x = x;
    this.y = y;
  }

}
