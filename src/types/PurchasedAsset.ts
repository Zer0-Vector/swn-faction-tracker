import AssetInfo from "./AssetInfo";

export default class PurchasedAsset {

  info: AssetInfo;
  hp: number;

  constructor(info: AssetInfo) {
    this.info = info;
    this.hp = info.maxHp;
  }

}
