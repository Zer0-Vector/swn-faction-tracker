import { Maybe } from "../Maybe";
import { SluggedEntity } from "../SluggedEntity";

/**
 * An ordered set with elements having two unique identifiers: `id` and `slug`.
 * The ordering is based on the order elements are added, however, elements can be reordered.
 */
export class SluggedOrderedSet<T extends SluggedEntity> {
  
  private id2element: Map<string, T>;
  private slug2id: Map<string, string>;
  private order: string[];

  /**
   * Constructs a set with the given contents.
   * @param initialValues The initial contents of the set. Default is `[]`.
   * @throws If there are any elements with conflicting ids or slugs. See the documentation for {@link add}.
   */
  constructor(initialValues: T[] = []) {
    this.id2element = new Map<string, T>();
    this.slug2id = new Map<string, string>();
    this.order = [];
    initialValues.forEach(value => this.add(value));
  }

  /**
   * Adds an element to the tail of the set.
   * @param element The element to add having properties "id" and "slug".
   * @throws If given id is blank or it conflicts with an existing id.
   * @throws If given slug is blank or it conflicts with an existing slug.
   */
  add(element: T): void {
    const { id, slug } = element;
    if (this.id2element.has(id)) {
      throw Error(`Already have id=${element.id}`);
    }
    if (this.slug2id.has(slug)) {
      throw Error(`Already have slug=${element.slug}`);
    }
    if (id.trim().length === 0) {
      throw Error("Cannot add element with blank id");
    }
    if (slug.trim().length === 0) {
      throw Error("Cannot add element with blank slug");
    }
    this.id2element.set(id, element);
    this.slug2id.set(slug, id);
    this.order.push(id);
  }

  /**
   * Removes an element from the set.
   * @param id The id of the element to remove.
   * @returns `true` if the element exists and was removed. `false`, otherwise.
   */
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

  /**
   * Renames a slug for a specific element. The new slug is trimmed before adding.
   * @param updateInfo An object with the id of the target element and the new slug for said element.
   * @throws If the given id does not exist in the set.
   * @throws If new slug is blank or conflicts with an existing element.
   */
  renameSlug(updateInfo: SluggedEntity): void {
    const storedElement = this.id2element.get(updateInfo.id);
    if (storedElement === undefined) {
      throw new Error(`Unknown element with id=${updateInfo.id}`);
    }
    
    if (updateInfo.slug.trim().length === 0) {
      throw Error("Cannot rename slug to blank");
    }

    if (this.slug2id.has(updateInfo.slug)) {
      throw new Error(`Slug conflict: ${updateInfo.slug}`);
    }

    const trimmed = updateInfo.slug.trim();
    this.slug2id.set(trimmed, updateInfo.id);
    this.slug2id.delete(storedElement.slug);
    storedElement.slug = trimmed;
  }

  /**
   * Retrieves an element from the set by its `id`.
   * @param id The id of the element to retrieve.
   * @returns The element with the given `id`, or undefined if the id does not map to anything.
   */
  get(id: string): Maybe<T> {
    return this.id2element.get(id);
  }

  /**
   * Retrieves an element from the set by its `slug`.
   * @param slug The slug of the element to retrieve.
   * @returns The element with the given `slug`, or undefined if the slug does not map to anything.
   */
  slugGet(slug: string): Maybe<T> {
    const id = this.slug2id.get(slug);
    if (id === undefined) {
      return undefined;
    }
    return this.id2element.get(id);
  }

  /**
   * Retrieves all elements in the set in order.
   * @returns An array of the elements in this set in order.
   */
  getAll(): T[] {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.order.map(id => this.id2element.get(id)!);
  }

  /**
   * Moves an element from its current index to a target index.
   * @param source The index of the element to move.
   * @param target The destination index for the element.
   */
  reorder(source: number, target: number) {
    if (source < 0 || source > this.order.length) {
      throw new Error(`Source index out of bounds: ${source}`);
    }
    
    if (target < 0 || target > this.order.length) {
      throw new Error(`Target index out of bounds: ${target}`);
    }

    const [removed] = this.order.splice(source, 1);
    this.order.splice(target, 0, removed);
  }

  /**
   * Checks if an element in the set has a given id.
   * @param id The id of an element.
   * @returns `true` if an element in the set has the given id. `false` otherwise.
   */
  hasId(id: string) {
    return this.id2element.has(id);
  }

  /**
   * Checks if an element in the set has the given slug.
   * @param slug The slug of an element.
   * @returns `true` if an element in the set has the given slug. `false` otherwise.
   */
  hasSlug(slug: string) {
    return this.slug2id.has(slug);
  }

  /**
   * Checks if the given entity has a unique id and a unique slug with respect to the existing elements in the set.
   * @param entity A potential element to add to the set.
   * @returns `true` if the element has a unique id among existing element ids and a unique slug among existing element slugs. `false` otherwise.
   */
  noConflicts(entity: T) {
    return !this.hasId(entity.id) && !this.hasSlug(entity.slug);
  }

}
