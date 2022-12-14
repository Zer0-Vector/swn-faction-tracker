import { randomUUID } from "crypto";
import { generateSlug } from "../utils/SlugGenerator";

export default class LocationInfo {
  id: string;
  name: string;
  tl: number;
  x: number;
  y: number;

  constructor(name: string, tl: number, x: number, y: number) {
    this.id = generateSlug(name);
    this.name = name;
    this.tl = tl;
    this.x = x;
    this.y = y;
  }

}
