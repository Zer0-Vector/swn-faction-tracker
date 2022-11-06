import ASSETS from "../data/Assets";

export default class PurchasedAsset {

  id: number;
  name: string;
  hp: number;

  constructor(id: number, name: string, hp?: number) {
    this.id = id;
    this.name = name;
    if (hp) {
      this.hp = hp;
    } else {
      const rawMaxHp = ASSETS[name].maxHp;
      if (rawMaxHp === null) {
        throw new Error(`Must specify hp for '${name}'`);
      } else {
        this.hp = rawMaxHp;
      }
    }
  }

}
