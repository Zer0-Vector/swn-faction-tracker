export class PurchasedAsset {

  id: number;
  name: string;
  hp: number;
  nickname?: string;
  location?: string;

  constructor(id: number, name: string, hp: number) {
    this.id = id;
    this.name = name;
    this.hp = hp;
  }

  static getKey(factionName: string, pa: PurchasedAsset): string {
    return `${factionName}.${pa.name}.${pa.id}`;
  }

}
