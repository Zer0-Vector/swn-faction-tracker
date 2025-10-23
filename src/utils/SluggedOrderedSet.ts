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

abstract class ASluggedOrderedSet<T extends SluggedEntity, E> implements ISluggedOrderedSet<T> {

  protected readonly idMap: Map<string, E> = new Map<string, E>();
  private readonly slug2id: Map<string, string> = new Map<string, string>();

  get size() {
    return this.idMap.size;
  }

  public abstract get(id: string): Maybe<T>;

  protected abstract doAdd(element: T): void;

  add(element: T): void {
    const { id, slug } = element;
    if (this.idMap.has(id)) {
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
    this.doAdd(element);
    this.slug2id.set(slug, id);
  }

  /**
   * Removes an element. Assume checks for the element's existence are `true`, i.e. it exists.
   */
  protected abstract doRemove(id: string): void;

  remove(id: string): boolean {
    const element = this.get(id);
    if (element === undefined) {
      return false;
    }

    this.doRemove(id);
    this.idMap.delete(id);
    this.slug2id.delete(element.slug);

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

  abstract at(index: number): T;

  slugGet(slug: string): Maybe<T> {
    const id = this.slug2id.get(slug);
    if (id === undefined) {
      return undefined;
    }
    return this.get(id);
  }

  abstract getAll(): T[];

  abstract reorder(source: number, target: number): void;

  hasId(id: string) {
    return this.idMap.has(id);
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

/**
 * An ordered set with elements having two unique identifiers: `id` and `slug`.
 * The ordering is based on the order elements are added, however, elements can be reordered.
 */
export class SluggedOrderedSet<T extends SluggedEntity>
  extends ASluggedOrderedSet<T, T>
  implements ISluggedOrderedSet<T>
{
  private readonly order: string[];

  /**
   * Constructs a set with the given contents.
   * @param initialValues The initial contents of the set. Default is `[]`.
   * @throws If there are any elements with conflicting ids or slugs. See the documentation for {@link add}.
   */
  constructor(initialValues: T[] = []) {
    super();
    this.order = [];
    for (const value of initialValues) {
      this.add(value);
    }
  }

  protected doAdd(element: T): void {
    this.idMap.set(element.id, element);
    this.order.push(element.id);
  }

  protected doRemove(id: string): void {
    this.idMap.delete(id);
    const index = this.order.indexOf(id);
    if (index !== -1) { // should always be true
      this.order.splice(index, 1);
    }
  }

  get(id: string): Maybe<T> {
    return this.idMap.get(id);
  }

  at(index: number): T {
    if (this.order.length === 0 || index < 0 || index >= this.order.length) {
      throw new RangeError("Index out of bounds");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- since order only contains valid ids, this is never undefined
    return this.get(this.order[index])!;
  }

  getAll(): T[] {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.order.map((id) => this.idMap.get(id)!);
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
}

export class SluggedCopyOnWriteArrayPoset<T extends SluggedEntity>
  extends ASluggedOrderedSet<T, number>
  implements ISluggedOrderedSet<T>
{
  private elements: T[];

  constructor() {
    super();
    this.elements = [];
  }

  get size(): number {
    return this.elements.length;
  }

  protected doAdd(element: T): void {
    const nextIndex = this.elements.length;
    this.elements = [...this.elements, element];
    this.idMap.set(element.id, nextIndex);
  }

  protected doRemove(id: string): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- existence has already been checked.
    const index = this.idMap.get(id)!;
    this.elements.splice(index, 1);
    this.elements = [...this.elements];
  }

  get(id: string): Maybe<T> {
    const index = this.idMap.get(id);
    if (index === undefined) {
      return undefined;
    }

    return this.elements[index];
  }

  getAll(): T[] {
    return this.elements;
  }

  at(index: number): T {
    if (index < 0 || index >= this.elements.length) {
      throw new RangeError("Index out of bounds");
    }
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
}
