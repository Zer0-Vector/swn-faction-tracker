import NamedCounter from "../NamedCounter";

describe('NamedCounter.increment', () => {
  beforeEach(() => {
    NamedCounter.reset();
  });

  it('returns 1 if counter DNE', () => {
    const result = NamedCounter.increment("test");
    expect(result).toBe(1);
  });

  it('returns 2 if counter is at 1', () => {
    const result = NamedCounter.increment("test2");
    expect(result).toBe(1);
    const result2 = NamedCounter.increment("test2");
    expect(result2).toBe(2);
  });
});

describe("NamedCounter.decrement", () => {
  it('returns 0 if DNE', () => {
    const result = NamedCounter.decrement("test3");
    expect(result).toBe(0);
  });

  it('returns 1 after 2 increments', () => {
    NamedCounter.increment("test4");
    NamedCounter.increment("test4");
    const result = NamedCounter.decrement("test4");
    expect(result).toBe(1);
  });
});

describe("NamedCounter.get", () => {
  it("returns 0 if DNE", () => {
    expect(NamedCounter.get("test5")).toBe(0);
  });

  it("returns 1 after increment", () => {
    expect(NamedCounter.get("test6")).toBe(0);
    NamedCounter.increment("test6");
    expect(NamedCounter.get("test6")).toBe(1);
  });
  
  it("returns current value", () => {
    expect(NamedCounter.get("test7")).toBe(0);
    expect(NamedCounter.increment("test7")).toBe(NamedCounter.get("test7"));
    expect(NamedCounter.increment("test7")).toBe(NamedCounter.get("test7"));
    expect(NamedCounter.increment("test7")).toBe(NamedCounter.get("test7"));
    expect(NamedCounter.decrement("test7")).toBe(NamedCounter.get("test7"));
    expect(NamedCounter.decrement("test7")).toBe(NamedCounter.get("test7"));
    expect(NamedCounter.decrement("test7")).toBe(NamedCounter.get("test7"));
  });
});
