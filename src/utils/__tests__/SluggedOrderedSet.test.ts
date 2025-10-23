import { beforeEach, describe, expect, it } from "vitest";
import { SluggedEntity } from "../../types/SluggedEntity";

import { ISluggedOrderedSet, SluggedCopyOnWriteArrayPoset, SluggedOrderedSet } from "../SluggedOrderedSet";

const blanks = ["", " ", "\t", "\f", "\r", "\n", " \t \f \r\n"];

describe.each([
  { name: "SluggedOrderedSet", factory: () => new SluggedOrderedSet() },
  { name: "SluggedCopyOnWriteArrayPoset", factory: () => new SluggedCopyOnWriteArrayPoset() }]
)("$name", ({ factory }) => {
  let set: ISluggedOrderedSet<SluggedEntity>;

  beforeEach(() => {
    set = factory();
  });

  it("constructor with args adds each element", () => {
    const elements = [
      { id: "1", slug: "one" },
      { id: "2", slug: "two" },
      { id: "3", slug: "three" },
    ];
    set = new SluggedOrderedSet(elements);
    for (const e of elements) {
      expect(set.get(e.id)).toBe(e);
      expect(set.slugGet(e.slug)).toBe(e);
    }
    expect(set.getAll()).toEqual(elements);
  });

  it("empty set is empty", () => {
    expect(set.getAll()).toHaveLength(0)
  });

  it("elements are returned in order from getAll", () => {
    const e1 = { id: "123", slug: "aaa" };
    const e2 = { id: "234", slug: "bbb" };
    const e3 = { id: "345", slug: "ccc" };
    set.add(e1);
    set.add(e2);
    set.add(e3);
    expect(set.getAll()).toEqual([e1, e2, e3]);
  });

  it("get element that DNE is undefined", () => {
    expect(set.get("dne")).toBeUndefined();
  });

  it("slugGet element that DNE is undefined", () => {
    expect(set.slugGet("dne")).toBeUndefined();
  });

  it("adding an element adds an element", () => {
    const element = { id: "1", slug: "abc" };
    set.add(element);
    expect(set.getAll().length).toBe(1);
    expect(set.getAll().includes(element)).toBe(true);
    expect(set.get("1")).toBe(element);
    expect(set.slugGet("abc")).toBe(element);
  });

  it("adding element with conflicting id throws", () => {
    const e1 = { id: "6", slug: "fff" };
    const e2 = { id: "6", slug: "ggg" };
    set.add(e1);
    expect(() => set.add(e2)).toThrowError("id");
  });

  it("adding element with conflicting slug throws", () => {
    const e1 = { id: "8", slug: "hhh" };
    const e2 = { id: "9", slug: "hhh" };
    set.add(e1);
    expect(() => set.add(e2)).toThrowError("slug");
  });

  describe.each(blanks)("adding element using blank (%j)", (blank) => {
    it("id throws", () => {
      const el = { id: blank, slug: "slug" };
      expect(() => set.add(el)).toThrowError("blank");
    });

    it("slug throws", () => {
      const el = { id: "id", slug: blank };
      expect(() => set.add(el)).toThrowError("blank");
    });
  });

  it("removing an element removes the element", () => {
    const e1 = { id: "123", slug: "slug1" };
    const e2 = { id: "222", slug: "slug2" };
    const e3 = { id: "333", slug: "slug3" };
    set.add(e2);
    set.add(e1);
    set.add(e3);
    const result = set.remove(e1.id);
    expect(result).toBe(true);
    expect(set.getAll()).toEqual([e2, e3]);
    expect(set.get(e1.id)).toBeUndefined();
    expect(set.slugGet(e1.slug)).toBeUndefined();
  });

  it("removing an element that DNE returns false", () => {
    expect(set.remove("dne")).toBe(false);
  });

  it("reordering an element changes getAll ordering", () => {
    const e1 = { id: "345", slug: "ccc" };
    const e2 = { id: "456", slug: "ddd" };
    const e3 = { id: "567", slug: "eee" };
    set.add(e1);
    set.add(e2);
    set.add(e3);
    set.reorder(0, 1);
    expect(set.getAll()).toEqual([e2, e1, e3]);
    set.reorder(1, 2);
    expect(set.getAll()).toEqual([e2, e3, e1]);
  });

  it("reordering index out of bounds throws", () => {
    set.add({ id: "e1", slug: "e-1" });
    set.add({ id: "e2", slug: "e-2" });
    expect(() => set.reorder(-1, 0)).toThrowError("index");
    expect(() => set.reorder(3, 0)).toThrowError("index");
    expect(() => set.reorder(0, -1)).toThrowError("index");
    expect(() => set.reorder(0, 5)).toThrowError("index");
  });

  it("renameSlug changes slug", () => {
    const e = { id: "123", slug: "before" };
    set.add(e);
    set.renameSlug({ id: "123", slug: "after" });
    expect(set.get("123")?.slug).toBe("after");
    expect(set.slugGet("before")).toBeUndefined();
    expect(set.slugGet("after")).toBe(e);
  });

  it("renameSlug throws if element DNE", () => {
    expect(() => set.renameSlug({ id: "10", slug: "dne" })).toThrowError(
      "id"
    );
  });

  it("renameSlug throws if slug already exists", () => {
    set.add({ id: "1", slug: "one" });
    set.add({ id: "2", slug: "two" });
    expect(() => set.renameSlug({ id: "1", slug: "two" })).toThrowError();
  });

  it.each(blanks)("renameSlug throws if slug is blank (%j)", (blank) => {
    set.add({ id: "1", slug: "one" });
    expect(() => set.renameSlug({ id: "1", slug: blank })).toThrowError(
      "blank"
    );
  });

  it("hasId and hasSlug reflect membership", () => {
    const e = { id: "x", slug: "xs" };
    expect(set.hasId("x")).toBe(false);
    expect(set.hasSlug("xs")).toBe(false);
    set.add(e);
    expect(set.hasId("x")).toBe(true);
    expect(set.hasSlug("xs")).toBe(true);
  });

  it("noConflicts returns true for unique and false on conflicts", () => {
    set.add({ id: "1", slug: "one" });
    expect(
      set.noConflicts({
        id: "2",
        slug: "two",
      })
    ).toBe(true);

    // Conflicting id
    expect(
      set.noConflicts({
        id: "1",
        slug: "two",
      })
    ).toBe(false);

    // Conflicting slug
    expect(
      set.noConflicts({
        id: "2",
        slug: "one",
      })
    ).toBe(false);

    // Both conflict
    expect(
      set.noConflicts({
        id: "1",
        slug: "one",
      })
    ).toBe(false);
  });

  it("getId converts slug to id or returns undefined", () => {
    set.add({ id: "a", slug: "aa" });
    expect(set.getId("aa")).toBe("a");
    expect(set.getId("does-not-exist")).toBeUndefined();
  });

  it("size reflects number of elements and updates on remove", () => {
    expect(set.size).toBe(0);
    set.add({ id: "s1", slug: "s-1" });
    set.add({ id: "s2", slug: "s-2" });
    expect(set.size).toBe(2);
    set.remove("s1");
    expect(set.size).toBe(1);
  });

  it("at returns the element at the given index", () => {
    const e1 = { id: "a1", slug: "s1" };
    const e2 = { id: "a2", slug: "s2" };
    const e3 = { id: "a3", slug: "s3" };
    set.add(e1);
    set.add(e2);
    set.add(e3);
    expect(set.at(0)).toBe(e1);
    expect(set.at(1)).toBe(e2);
    expect(set.at(2)).toBe(e3);
  });

  it("at throws RangeError when called on an empty set", () => {
    expect(() => set.at(0)).toThrowError(RangeError);
    expect(() => set.at(0)).toThrowError("Index out of bounds");
  });

  it("at throws RangeError for out-of-bounds indices", () => {
    set.add({ id: "x1", slug: "xs1" });
    set.add({ id: "x2", slug: "xs2" });
    expect(() => set.at(-1)).toThrowError(RangeError);
    expect(() => set.at(-1)).toThrowError("Index out of bounds");
    expect(() => set.at(2)).toThrowError(RangeError);
    expect(() => set.at(2)).toThrowError("Index out of bounds");
  });

});
