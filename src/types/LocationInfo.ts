import { generateId } from "../utils/IdGenerator";

export default class LocationInfo {
  
  id: string;
  name: string;
  tl: number;
  x: number;
  y: number;

  constructor(name: string, tl: number, x: number, y: number) {
    this.id = generateId(name);
    this.name = name;
    this.tl = tl;
    this.x = x;
    this.y = y;
  }

}
