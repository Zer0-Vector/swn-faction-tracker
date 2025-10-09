import { beforeEach, describe, expect, it } from "vitest";
import { SluggedEntity } from "../../types/SluggedEntity";

import { SluggedOrderedSet } from "../SluggedOrderedSet";

const blanks = [ "", " ", "\t", "\f", "\r", "\n", " \t \f \r\n" ];

describe('SluggedOrderedSet', () => {
  let set: SluggedOrderedSet<SluggedEntity>;

  beforeEach(() => {
    set = new SluggedOrderedSet();
  });

  describe('constructor', () => {
    it('with args adds each element', () => {
      const elements = [
        { id: "1", slug: "one" },
        { id: "2", slug: "two" },
        { id: "3", slug: "three" },
      ];
      set = new SluggedOrderedSet(elements);
      elements.forEach(e => {
        expect(set.get(e.id)).toBe(e);
        expect(set.slugGet(e.slug)).toBe(e);
        expect(set.getAll()).toEqual(elements);
      });
    });

    it('empty set is empty', () => {
      expect(set.getAll().length).toBe(0);
    });
  });

  describe('getAll', () => {
    it('elements are returned in order', () => {
      const e1 = { id: "123", slug: "aaa" };
      const e2 = { id: "234", slug: "bbb" };
      const e3 = { id: "345", slug: "ccc" };
      set.add(e1);
      set.add(e2);
      set.add(e3);
      expect(set.getAll()).toEqual([e1, e2, e3]);
    });
  });

  describe('get/slugGet', () => {
    it('getting element that DNE is undefined', () => {
      expect(set.get("dne")).toBeUndefined();
      expect(set.slugGet("dne")).toBeUndefined();
    });
  });

  describe('add', () => {
    it('adding an element adds an element', () => {
      const element = { id: "1", slug: "abc" };
      set.add(element);
      expect(set.getAll().length).toBe(1);
      expect(set.getAll().includes(element)).toBe(true);
      expect(set.get("1")).toBe(element);
      expect(set.slugGet("abc")).toBe(element);
    });

    it('adding element with conflicting id throws', () => {
      const e1 = { id: "6", slug: "fff" };
      const e2 = { id: "6", slug: "ggg" };
      set.add(e1);
      expect(() => set.add(e2)).toThrowError("id");
    });

    it('adding element with conflicting slug throws', () => {
      const e1 = { id: "8", slug: "hhh" };
      const e2 = { id: "9", slug: "hhh" };
      set.add(e1);
      expect(() => set.add(e2)).toThrowError("slug");
    });

    describe.each(blanks)('adding element using blank (%j)', blank => {
      it('id throws', () => {
        const el = { id: blank, slug: "slug" };
        expect(() => set.add(el)).toThrowError("blank");
      });

      it('slug throws', () => {
        const el = { id: "id", slug: blank };
        expect(() => set.add(el)).toThrowError("blank");
      });
    });
  });

  describe('remove', () => {
    it('removing an element removes the element', () => {
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

    it('removing an element that DNE returns false', () => {
      expect(set.remove("dne")).toBe(false);
    });
  });

  describe('reorder', () => {
    it('reordering an element changes getAll ordering', () => {
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

    it('reordering index out of bounds throws', () => {
      set.add({ id: "e1", slug: "e-1" });
      set.add({ id: "e2", slug: "e-2" });
      expect(() => set.reorder(-1, 0)).toThrowError("index");
      expect(() => set.reorder(3, 0)).toThrowError("index");
      expect(() => set.reorder(0, -1)).toThrowError("index");
      expect(() => set.reorder(0, 5)).toThrowError("index");
    });
  });

  describe('renameSlug', () => {
    it('changes slug', () => {
      const e = { id: "123", slug: "before" };
      set.add(e);
      set.renameSlug({ id: "123", slug: "after" });
      expect(set.get("123")?.slug).toBe("after");
      expect(set.slugGet("before")).toBeUndefined();
      expect(set.slugGet("after")).toBe(e);
    });

    it('throws if element DNE', () => {
      expect(() => set.renameSlug({ id: "10", slug: "dne" })).toThrowError("id");
    });

    it('throws if slug already exists', () => {
      set.add({ id: "1", slug: "one" });
      set.add({ id: "2", slug: "two" });
      expect(() => set.renameSlug({ id: "1", slug: "two" })).toThrowError();
    });

    it.each(blanks)('throws if slug is blank (%j)', blank => {
      set.add({ id: "1", slug: "one" });
      expect(() => set.renameSlug({ id: "1", slug: blank })).toThrowError("blank");
    });
  });
});
