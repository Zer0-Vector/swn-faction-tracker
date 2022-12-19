import { NamedEntity } from "./NamedElementPoset";

export default class LocationInfo implements NamedEntity {

  constructor(
    public readonly id: string,
    public slug: string,
    public name: string,
    public tl: number,
    public x: number,
    public y: number
  ) {}

}
