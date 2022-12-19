import { generateSlug } from "../SlugGenerator";

describe('generateId(*)', () => {
  describe('returns input when only aphanumeric', () => {
    it.each(
      [
        "test123",
        "hello",
        "1234567",
        "123test123",
      ]
    )('%p remains unchanged', (input: string) => {
      expect(generateSlug(input)).toEqual(input);
    });
  });

  describe('trims leading and trailing spaces', () => {
    it.each([
      [" test ", "test"],
      ["\ttest", "test"],
      ["\n\rtest543\t", "test543"],
    ])('%p returns %p', (input: string, expected: string) => {
      expect(generateSlug(input)).toEqual(expected);
    });
  });

  describe('converts subsequent non-word characters into a hyphen', () => {
    it.each(
      [
        ["hello_you", "hello-you"],
        ["hello world", "hello-world"],
        ["hello*&^world", "hello-world"],
        ["hello---world", "hello-world"],
        ["123-3.2", "123-3-2"],
      ]
    )('converts %p into %p', (input: string, expected: string) => {
      expect(generateSlug(input)).toEqual(expected);
    });
  });
});

describe('generateId("hw", [x, ...])', () => {
  it.each([ // input will be "hw" for each
    [["hw"], 1],
    [["hw-1"], 2],
    [["hw-2"], 1],
    [["hw-3", "wh"], 1],
    [["hw", "hw-2"], 1],
    [["hw", "hw-2", "hw-1"], 3],
    [["hw-1", "hw-2","hw-3"], 4],
    [["hw-1","hw-3"], 4],
  ])('given "hw" with exising %p, expect "hw-%p"', (currentValues: string[], expectedSuffix: number) => {
    expect(generateSlug("hw", currentValues)).toEqual(`hw-${expectedSuffix}`);
  });
});

describe('generateId(*, [*, ...])', () => {
  it.each([
    ["hw-1", ["hw-1", "hw-2"], "hw-3"],
    ["hw-2", ["hw-1", "hw-2", "hw-3"], "hw-4"],
    ["h-=*=-w-1", ["h-w-1", "h-w-3"], "h-w-4"],
    ["1.4.3", ["1-4-3"], "1-4-4"], // this is a strange case, but the results just need to be unique; sometimes they won't make sense
    ["hw-7", ["hw-1", "hw-2"], "hw-7"],
    ["abc", ["hw", "hw-1", "hw-54"], "abc-1"],
  ])('given %p with existing %p, expect %p', (input: string, currentValues: string[], expected: string) => {
    expect(generateSlug(input, currentValues)).toEqual(expected);
  });
});
