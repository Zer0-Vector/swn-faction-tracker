import { v4 as randomUuid } from "uuid";

import { generateSlug } from "../../utils/SlugGenerator";
import { Maybe } from "../Maybe";
import { IObservable, Observable } from "../Observable";
import { SluggedEntity } from "../SluggedEntity";
import { SluggedOrderedSet } from "../SluggedOrderedSet";

export type NamedEntity = SluggedEntity & { name: string };

export type ArgsWithName<Args = {}> = { name: string } & Args;

/**
 * @template T The type of elements in the poset.
 * @template A Additional arguments needed to create a type `T`.
 * @template N Additional keys that should not be allowed to be updated.
 * @template M Additional args needed to check name.
 */
export interface INamedElementPoset<
  T extends NamedEntity & A,
  A = {},
  N extends keyof ArgsWithName<A> = never,
  M extends keyof A = never
>
    extends IObservable<NamedElementPosetAction<T>> {
  add(args: ArgsWithName<A>): T;
  remove(id: string): boolean;
  get(id: string): Maybe<T>;
  slugGet(slug: string): Maybe<T>;
  getId(slug: string): Maybe<string>;
  getAll(): T[];
  reorder(source: number, target: number): void;
  update<K extends keyof Omit<T, N | keyof SluggedEntity>>(id: string, key: K, value: T[K]): NamedEntity;
  checkName(args: ArgsWithName<Pick<A, M>>): boolean;
}

type NamedElementFactoryFn<T extends NamedEntity, A> = (input: NamedEntity & A) => T;

type NamedElementPosetActionType = "ADD" | "REMOVE" | "REORDER" | "UPDATE";

type NamedElementPosetAction<T> = {
  type: NamedElementPosetActionType,
  id: string,
} | {
  type: "REORDER",
} | {
  type: "UPDATE",
  id: string,
  key: keyof T,
};

type FilterFuncGenerator<X, Y> = (args: X) => (arg: Y) => boolean;

export class NamedElementPoset<T extends NamedEntity & A, A = {}, N extends keyof ArgsWithName<A>  = never, M extends keyof A = never>
  extends Observable<NamedElementPosetAction<T>>
  implements INamedElementPoset<T, A, N> {

  private readonly factory: NamedElementFactoryFn<T, A>;
  private readonly set: SluggedOrderedSet<T>;
  private readonly filterFunc?: FilterFuncGenerator<Omit<ArgsWithName<Pick<A, M>>, "name">, T>;

  constructor(factory: NamedElementFactoryFn<T, A>, elements: T[] = [], filterFunc?: FilterFuncGenerator<Omit<ArgsWithName<Pick<A, M>>, "name">, T>) {
    super();
    this.factory = factory;
    this.set = new SluggedOrderedSet(elements);
    this.filterFunc = filterFunc;
  }

  add(args: ArgsWithName<A>): T {
    const id = randomUuid();
    const element = this.factory({
      id,
      slug: this.getNextSlug(args),
      ...args,
    });
    this.set.add(element);
    this.notifyObservers({ type: "ADD", id });
    return element;
  }

  remove(id: string): boolean {
    const result = this.set.remove(id);
    if (result) {
      this.notifyObservers({ type: "REMOVE", id });
    }
    return result;
  }

  get(id: string): Maybe<T> {
    return this.set.get(id);
  }

  slugGet(slug: string): Maybe<T> {
    return this.set.slugGet(slug);
  }

  getAll(): T[] {
    return this.set.getAll();
  }

  reorder(source: number, target: number): void {
    this.set.reorder(source, target);
    this.notifyObservers({ type: "REORDER" });
  }

  update<K extends keyof Omit<T, N | keyof SluggedEntity>>(id: string, key: K, value: T[K]): NamedEntity {
    const element = this.set.get(id);
    if (element === undefined) {
      throw new Error(`Cannot update ${String(key)}, unknown id=${id}`);
    }
    if (key === "name") {
      if (!this.checkName({ ...element, name: value })) {
        throw new Error(`Conflicting name ${value}`);
      }

      element.slug = this.getNextSlug({...element, name: value });
    }
    element[key] = value;
    this.notifyObservers({ type: "UPDATE", id, key });
    return element;
  }

  checkName(args: ArgsWithName<Pick<A, M>>): boolean {
    const slug = this.getNextSlug(args);
    return !this.set.hasSlug(slug);
  }

  getId(slug: string) {
    return this.set.getId(slug);
  }

  private getNextSlug(args: ArgsWithName<Pick<A, M>>) {
    return this.filterFunc !== undefined 
        ? generateSlug(args.name, 
            this.getAll()
                .filter(this.filterFunc(args))
                .map(e => e.slug)) 
        : generateSlug(args.name);
  }

}
