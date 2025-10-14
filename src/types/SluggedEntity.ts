export interface Identifiable {
  readonly id: string;
}

export interface SluggedEntity extends Identifiable {
  slug: string;
}
