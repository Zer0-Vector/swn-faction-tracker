import TextUtils from "../TextUtils";

describe('TextUtils.capitalize', () => {
  it('returns empty string when given empty string or undefined', () => {
    expect(TextUtils.capitalize("")).toBe("");
    expect(TextUtils.capitalize([undefined, 'c'] as unknown as string)).toBe("");
    expect(TextUtils.capitalize([null, 'c'] as unknown as string)).toBe("");
    expect(TextUtils.capitalize("\0")).toBe("\0");
  });

  it('does not capitalize symbols or whitespace', () => {
    expect(TextUtils.capitalize(" hello")).toBe(" hello");
    expect(TextUtils.capitalize("/world")).toBe("/world");
  });

  it('ignores null elements after first', () => {
    expect(TextUtils.capitalize(["c", null, "d"] as unknown as string)).toBe("Cd");
    expect(TextUtils.capitalize(["e", undefined, "f"] as unknown as string)).toBe("Ef");
  });

  it('capitalizes first letter', () => {
    expect(TextUtils.capitalize("hello")).toBe("Hello");
    expect(TextUtils.capitalize("World")).toBe("World");
    expect(TextUtils.capitalize("hello world")).toBe("Hello world");
    expect(TextUtils.capitalize("ärthur")).toBe("Ärthur");
  });
});
