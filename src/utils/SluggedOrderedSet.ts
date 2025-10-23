import { Maybe } from "../types/Maybe";
import { SluggedEntity } from "../types/SluggedEntity";

export interface ISluggedOrderedSet<T extends SluggedEntity> {
  size: number;

  /**
   * Adds an element to the tail of the set.
   * @param element The element to add having properties "id" and "slug".
   * @throws If given id is blank or it conflicts with an existing id.
   * @throws If given slug is blank or it conflicts with an existing slug.
   */
  add(element: T): void;

  /**
   * Removes an element from the set.
   * @param id The id of the element to remove.
   * @returns `true` if the element exists and was removed. `false`, otherwise.
   */
  remove(id: string): boolean;

  /**
   * Renames a slug for a specific element. The new slug is trimmed before adding.
   * @param updateInfo An object with the id of the target element and the new slug for said element.
   * @throws If the given id does not exist in the set.
   * @throws If new slug is blank or conflicts with an existing element.
   */
  renameSlug(info: SluggedEntity): void;

  /**
   * Retrieves an element from the set by its `id`.
   * @param id The id of the element to retrieve.
   * @returns The element with the given `id`, or `undefined` if the id does not map to anything.
   */
  get(id: string): Maybe<T>;

  /**
   * Retrieves an element from the set by its `slug`.
   * @param slug The slug of the element to retrieve.
   * @returns The element with the given `slug`, or `undefined` if the slug does not map to anything.
   */
  slugGet(slug: string): Maybe<T>;

  /**
   * Retrieves all elements in the set in order.
   * @returns An array of the elements in this set in order.
   */
  getAll(): T[];

  /**
   * @returns Element at the index given.
   * @throws {RangeError} If the index is out of bounds
   */
  at(index: number): T;

  /**
   * Moves an element from its current index to a target index.
   * @param source The index of the element to move.
   * @param target The destination index for the element.
   */
  reorder(source: number, target: number): void;

  /**
   * Checks if an element in the set has a given id.
   * @param id The id of an element.
   * @returns `true` if an element in the set has the given id. `false` otherwise.
   */
  hasId(id: string): boolean;

  /**
   * Checks if an element in the set has the given slug.
   * @param slug The slug of an element.
   * @returns `true` if an element in the set has the given slug. `false` otherwise.
   */
  hasSlug(slug: string): boolean;

  /**
   * Checks if the given entity has a unique id and a unique slug with respect to the existing elements in the set.
   * @param entity A potential element to add to the set.
   * @returns `true` if the element has a unique id among existing element ids and a unique slug among existing element slugs. `false` otherwise.
   */
  noConflicts(entity: SluggedEntity): boolean;

  /**
   * Converts a slug to its respective id.
   * @param slug The slug to convert to an id.
   */
  getId(slug: string): Maybe<string>;
}

/**
 * An ordered set with elements having two unique identifiers: `id` and `slug`.
 * The ordering is based on the order elements are added, however, elements can be reordered.
 */
export class SluggedOrderedSet<T extends SluggedEntity>
  implements ISluggedOrderedSet<T>
{
  private readonly id2element: Map<string, T>;
  private readonly slug2id: Map<string, string>;
  private readonly order: string[];

  /**
   * Constructs a set with the given contents.
   * @param initialValues The initial contents of the set. Default is `[]`.
   * @throws If there are any elements with conflicting ids or slugs. See the documentation for {@link add}.
   */
  constructor(initialValues: T[] = []) {
    this.id2element = new Map<string, T>();
    this.slug2id = new Map<string, string>();
    this.order = [];
    initialValues.forEach((value) => {
      this.add(value);
    });
  }

  get size() {
    return this.id2element.size;
  }

  add(element: T): void {
    const { id, slug } = element;
    if (this.id2element.has(id)) {
      throw new Error(`Already have id=${element.id}`);
    }
    if (this.slug2id.has(slug)) {
      throw new Error(`Already have slug=${element.slug}`);
    }
    if (id.trim().length === 0) {
      throw new Error("Cannot add element with blank id");
    }
    if (slug.trim().length === 0) {
      throw new Error("Cannot add element with blank slug");
    }
    this.id2element.set(id, element);
    this.slug2id.set(slug, id);
    this.order.push(id);
  }

  remove(id: string): boolean {
    const element = this.id2element.get(id);
    if (element === undefined) {
      return false;
    }
    this.slug2id.delete(element.slug);
    const result = this.id2element.delete(id);
    const index = this.order.indexOf(id);
    if (index !== -1) {
      this.order.splice(index, 1);
    }
    return result;
  }

  renameSlug(updateInfo: SluggedEntity): void {
    const storedElement = this.id2element.get(updateInfo.id);
    if (storedElement === undefined) {
      throw new Error(`Unknown element with id=${updateInfo.id}`);
    }

    if (updateInfo.slug.trim().length === 0) {
      throw new Error("Cannot rename slug to blank");
    }

    if (this.slug2id.has(updateInfo.slug)) {
      throw new Error(`Slug conflict: ${updateInfo.slug}`);
    }

    const trimmed = updateInfo.slug.trim();
    this.slug2id.set(trimmed, updateInfo.id);
    this.slug2id.delete(storedElement.slug);
    storedElement.slug = trimmed;
  }

  get(id: string): Maybe<T> {
    return this.id2element.get(id);
  }

  at(index: number): T {
    if (this.order.length === 0 || index < 0 || index >= this.order.length) {
      throw new RangeError("Index out of bounds");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- since order only contains valid ids, this is never undefined
    return this.get(this.order[index])!;
  }

  slugGet(slug: string): Maybe<T> {
    const id = this.slug2id.get(slug);
    if (id === undefined) {
      return undefined;
    }
    return this.id2element.get(id);
  }

  getAll(): T[] {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.order.map((id) => this.id2element.get(id)!);
  }

  reorder(source: number, target: number) {
    if (source < 0 || source >= this.order.length) {
      throw new Error(`Source index out of bounds: ${source}`);
    }

    if (target < 0 || target >= this.order.length) {
      throw new Error(`Target index out of bounds: ${target}`);
    }

    const [removed] = this.order.splice(source, 1);
    this.order.splice(target, 0, removed);
  }

  hasId(id: string) {
    return this.id2element.has(id);
  }

  hasSlug(slug: string) {
    return this.slug2id.has(slug);
  }

  noConflicts(entity: SluggedEntity) {
    return !this.hasId(entity.id) && !this.hasSlug(entity.slug);
  }

  getId(slug: string): Maybe<string> {
    return this.slug2id.get(slug);
  }
}

export class SluggedCopyOnWriteArrayPoset<T extends SluggedEntity>
  implements ISluggedOrderedSet<T>
{
  private readonly id2index: Map<string, number>;
  private readonly slug2id: Map<string, string>;
  private elements: T[];

  constructor() {
    this.id2index = new Map();
    this.slug2id = new Map();
    this.elements = [];
  }

  get size(): number {
    return this.elements.length;
  }

  add(element: T): void {
    const nextIndex = this.elements.length;
    this.elements = [...this.elements, element];
    this.id2index.set(element.id, nextIndex);
    this.slug2id.set(element.slug, element.id);
  }
  remove(id: string): boolean {
    const index = this.id2index.get(id);
    if (index === undefined) {
      return false;
    }

    const [deleted] = this.elements.splice(index, 1);

    this.id2index.delete(deleted.id);
    this.slug2id.delete(deleted.slug);
    this.elements = [...this.elements];

    return true;
  }
  renameSlug(updateInfo: SluggedEntity): void {
    const storedElement = this.get(updateInfo.id);
    if (storedElement === undefined) {
      throw new Error(`Unknown element with id=${updateInfo.id}`);
    }

    if (updateInfo.slug.trim().length === 0) {
      throw new Error("Cannot rename slug to blank");
    }

    if (this.slug2id.has(updateInfo.slug)) {
      throw new Error(`Slug conflict: ${updateInfo.slug}`);
    }

    const trimmed = updateInfo.slug.trim();
    this.slug2id.set(trimmed, updateInfo.id);
    this.slug2id.delete(storedElement.slug);
    storedElement.slug = trimmed;
  }
  get(id: string): Maybe<T> {
    const index = this.id2index.get(id);
    if (index === undefined) {
      return undefined;
    }

    return this.elements[index];
  }
  slugGet(slug: string): Maybe<T> {
    const id = this.slug2id.get(slug);
    if (!id) {
      return undefined;
    }
    return this.get(id);
  }
  getAll(): T[] {
    return this.elements;
  }
  at(index: number): T {
    return this.elements[index];
  }
  reorder(source: number, target: number): void {
    if (source < 0 || source >= this.elements.length) {
      throw new Error(`Source index out of bounds: ${source}`);
    }

    if (target < 0 || target >= this.elements.length) {
      throw new Error(`Target index out of bounds: ${target}`);
    }

    const [removed] = this.elements.splice(source, 1);
    this.elements.splice(target, 0, removed);
    this.elements = [...this.elements];
  }
  hasId(id: string): boolean {
    return this.id2index.has(id);
  }
  hasSlug(slug: string): boolean {
    return this.slug2id.has(slug);
  }
  noConflicts(entity: SluggedEntity): boolean {
    return !this.hasId(entity.id) && !this.hasSlug(entity.slug);
  }
  getId(slug: string): Maybe<string> {
    return this.slug2id.get(slug);
  }
}
