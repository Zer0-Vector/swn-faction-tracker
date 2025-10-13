import { v4 as randomUuid } from "uuid";

import { Maybe } from "../types/Maybe";
import type { Prettify } from "../types/Prettify";
import { SluggedEntity } from "../types/SluggedEntity";

import { IObservable, Observable } from "./Observable";
import { ISluggedOrderedSet, SluggedCopyOnWriteArrayPoset } from "./SluggedOrderedSet";
import { generateSlug } from "./SlugGenerator";

export type NamedSluggedEntity = Prettify<Named<SluggedEntity>>;

export type Named<T = {}> = T & { name: string };

export type NamedEntityWithReadonlyProps<TProps, ReadonlyKeys extends keyof Named<TProps>> =
    NamedSluggedEntity & TProps & Readonly<Pick<Named<TProps>, ReadonlyKeys>>;

/**
 * @template T The type of elements in the poset.
 * @template A Additional arguments needed to create a type `T`.
 * @template N Additional keys that should not be allowed to be updated.
 * @template M Additional args needed to check name.
 */
export interface INamedElementPoset<
  T extends NamedSluggedEntity & A,
  A = {},
  N extends keyof Named<A> = never,
  M extends keyof A = never
>
    extends IObservable<NamedElementPosetAction<T>> {
  size: number;
  add(args: Named<A>): T;
  remove(id: string): boolean;
  get(id: string): Maybe<T>;
  slugGet(slug: string): Maybe<T>;
  getId(slug: string): Maybe<string>;
  getAll(): T[];
  reorder(source: number, target: number): void;
  update<K extends keyof Omit<T, N | keyof SluggedEntity>>(id: string, key: K, value: T[K]): NamedSluggedEntity;
  checkName(args: Named<Pick<A, M>>): boolean;
}

type NamedElementFactoryFn<T extends NamedSluggedEntity, A> = (input: Prettify<NamedSluggedEntity & A>) => T;

type NamedElementPosetActions<T> = {
  ADD: {
    id: string,
  },
  REMOVE: {
    id: string,
  },
  REORDER: {
    id: string,
    index: number,
    previousIndex: number,
  },
  UPDATE: {
    id: string,
    key: keyof T,
    value: T[keyof T]
  }
}

export type NamedElementPosetAction<T> = {
  [K in keyof NamedElementPosetActions<T>]: Prettify<{
    type: K
  } & NamedElementPosetActions<T>[K]>
}[keyof NamedElementPosetActions<T>];

type FilterFuncGenerator<X, Y> = (args: X) => (arg: Y) => boolean;

export class NamedElementPoset<
    T extends NamedSluggedEntity & A,
    A = {},
    N extends keyof Named<A>  = never,
    M extends keyof A = never>
  extends Observable<NamedElementPosetAction<T>>
  implements INamedElementPoset<T, A, N> {

  private readonly factory: NamedElementFactoryFn<T, A>;
  private readonly set: ISluggedOrderedSet<T>;
  private readonly filterFunc?: FilterFuncGenerator<Omit<Named<Pick<A, M>>, "name">, T>;

  constructor(factory: NamedElementFactoryFn<T, A>, elements: T[] = [], filterFunc?: FilterFuncGenerator<Omit<Named<Pick<A, M>>, "name">, T>) {
    super();
    this.factory = factory;
    this.set = new SluggedCopyOnWriteArrayPoset();
    elements.forEach(e => {
      this.set.add(factory(e));
    });
    this.filterFunc = filterFunc;
  }

  get size() {
    return this.set.size;
  }

  add(args: Named<A>): T {
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
    this.notifyObservers({
      type: "REORDER",
      id: this.set.at(target).id,
      index: target,
      previousIndex: source,
    });
  }

  update<K extends keyof Omit<T, N | keyof SluggedEntity>>(id: string, key: K, value: T[K]): T {
    const element = this.set.get(id);
    if (element === undefined) {
      throw new Error(`Cannot update ${String(key)}, unknown id=${id} keys: ${this.set.getAll().map(e => e.slug)}`);
    }
    if (key === "name") {
      if (!this.checkName({ ...element, name: value })) {
        throw new Error(`Conflicting name ${value}`);
      }

      element.slug = this.getNextSlug({...element, name: value });
    }
    element[key] = value;
    this.notifyObservers({ type: "UPDATE", id, key, value });
    return element;
  }

  checkName(args: Named<Pick<A, M>>): boolean {
    const slug = this.getNextSlug(args);
    return !this.set.hasSlug(slug);
  }

  getId(slug: string) {
    return this.set.getId(slug);
  }

  private getNextSlug(args: Named<Pick<A, M>>) {
    return this.filterFunc !== undefined
        ? generateSlug(args.name,
            this.getAll()
                .filter(this.filterFunc(args))
                .map(e => e.slug))
        : generateSlug(args.name);
  }

}
