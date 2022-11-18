export default class AssetId {
  
  constructor(
    public readonly displayName: string, // title case
    public readonly index: number
  ) {}

  static toRefFormat(id: AssetId): string {
    return `${AssetId.toRefName(id.displayName)}-${id.index}`;
  }

  static toRefName(displayName: string) {
    return displayName.toLowerCase().replace(/[\W_]+/g, "-");
  }

}
