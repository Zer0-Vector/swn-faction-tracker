import { NamedElementPoset, NamedSluggedEntity } from "./NamedElementPoset";

describe('NamedElementPoset(x => x, [], undefined)', () => {
  let poset: NamedElementPoset<NamedSluggedEntity>;

  beforeEach(() => {
    poset = new NamedElementPoset(x => x);
  });

  it('is empty on init', () => {
    expect(poset.getAll()).toEqual([]);
    expect(poset.get("dne")).toBeUndefined();
    expect(poset.remove("dne")).toBe(false);
    expect(poset.checkName({ name: "anything" })).toBe(true);
    expect(poset.getId("dne")).toBeUndefined();
    expect(poset.slugGet("dne")).toBeUndefined();
    expect(() => poset.update("dne", "name", "whatever")).toThrowError();
    expect(() => poset.reorder(0, 0)).toThrowError();
  });

  it('adding element adds element and updating it modifies the same ref', () => {
    const element = poset.add({ name: "TEST 123" });
    expect(element.id).toBeDefined();
    expect(element.id.length).toBeGreaterThan(0);
    expect(element.name).toBe("TEST 123");
    expect(element.slug).toBe("test-123");
    expect(poset.getAll()).toEqual([element]);
    expect(poset.checkName({ name: "test 123" })).toBe(false);
    expect(poset.get(element.id)).toBe(element);
    expect(poset.slugGet(element.slug)).toBe(element);
    expect(() => poset.reorder(0, 0)).not.toThrow();
  });

  it('removing element removes the element', () => {
    const e1 = poset.add({ name: "test 1" });
    const e2 = poset.add({ name: "test 2" });
    expect(poset.remove(e1.id)).toBe(true);
    expect(poset.getAll()).toEqual([e2]);
  });

  it('updating element modifies the same reference', () => {
    const element = poset.add({ name: "TEST 123" });
    const updated = poset.update(element.id, "name", "Hello, World");
    expect(updated).toEqual({
      id: element.id,
      name: "Hello, World",
      slug: "hello-world",
    });
    expect(updated).toBe(element);
    expect(element.name).toEqual("Hello, World");
    expect(element.slug).toEqual("hello-world");
  });

  it('reordering elements reorders them', () => {
    const e1 = poset.add({ name: "e 1" });
    const e2 = poset.add({ name: "d 2" });
    expect(poset.getAll()).toEqual([e1, e2]);
    expect(() => poset.reorder(0, 1)).not.toThrow();
    expect(poset.getAll()).toEqual([e2, e1]);
  });

  it('subscribers notified when element added', () => {
    const fn = jest.fn();
    const unsubscribe = poset.subscribe(fn);
    const element = poset.add({ name: "cb" });
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith({ type: "ADD", id: element.id });
    unsubscribe();
  });

  it('subscribers notified when element removed', () => {
    const fn = jest.fn();
    const element = poset.add({ name: "cb" });
    const unsubscribe = poset.subscribe(fn);
    expect(poset.remove(element.id)).toBe(true);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith({ type: "REMOVE", id: element.id });
    unsubscribe();
  });

  it('subscribers notified when element reordered', () => {
    const fn = jest.fn();
    poset.add({ name: "cb" });
    poset.add({ name: "az" });
    const unsubscribe = poset.subscribe(fn);
    expect(() => poset.reorder(1, 0)).not.toThrow();
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith({ type: "REORDER" });
    unsubscribe();
  });

  it('subscribers notified when element updated', () => {
    const fn = jest.fn();
    const element = poset.add({ name: "cb" });
    const unsubscribe = poset.subscribe(fn);
    expect(poset.update(element.id, "name", "de")).toBe(element);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith({ type: "UPDATE", id: element.id, key: "name" });
    unsubscribe();
  });

  it('subscribers not notified when unsubscribed', () => {
    const fn = jest.fn();
    const element = poset.add({ name: "cb" });
    const unsubscribe = poset.subscribe(fn);
    expect(poset.update(element.id, "name", "de")).toBe(element);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith({ type: "UPDATE", id: element.id, key: "name" });
    unsubscribe();
    poset.update(element.id, "name", "ef");
    expect(fn).not.toBeCalledTimes(2);
  });
});
