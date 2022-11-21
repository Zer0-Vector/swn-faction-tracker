import AssetId from "../AssetId";

describe('toRefName', () => {
  it.each([
    ["test0", "test0"],
    ["Test One", "test-one"],
    ["Test_Two", "test-two"],
    ["Test({}[])Three", "test-three"],
    ["test\tfour", "test-four"],
  ])('transforms %p into %p', (input: string, expected: string) => {
    expect(AssetId.toRefName(input)).toEqual(expected);
  });
});

describe('toRefFormat', () => {
  it.each([
    [new AssetId("Test Zero", 0), "test-zero-0"],
    [new AssetId("TestOne", 1), "testone-1"],
  ])('trasforms %p into %p', (input: AssetId, expected: string) => {
    expect(AssetId.toRefFormat(input)).toEqual(expected);
  });
});
