import { ValidationController } from "./ValidationController";

describe("ValidationController", () => {
  const mockValidators = {
    one: jest.fn(),
    two: jest.fn(),
  };
  let controller = new ValidationController(mockValidators);

  beforeEach(() => {
    controller = new ValidationController(mockValidators);
  });

  it('isAllValid is false on init', () => {
    expect(controller.isAllValid()).toBe(false);
  });

  it.each(["one", "two"])('isValid is false on init for %p', (k: string) => {
    expect(controller.isValid(k)).toBe(false);
  });

  it('isValid throws Error on unknown key', () => {
    const f = () => controller.isValid("three");
    expect(f).toThrowError(/Unknown/);
    expect(f).toThrowError(/three/);
  });

  it('validate throws Error on unknown key', () => {
    const f = () => controller.validate("four", "test");
    expect(f).toThrowError(/Unknown/);
    expect(f).toThrowError(/four/);
  });

  it('on validated, validate returns true when valid', () => {
    mockValidators.one.mockImplementationOnce(() => true);
    const result = controller.validate("one", "test");
    expect(result).toBe(true);
    expect(controller.isValid("one")).toBe(true);
    expect(controller.isAllValid()).toBe(false);
  });
  
  it('when all are validated, isAllValid returns true', () => {
    mockValidators.one.mockImplementationOnce(() => true);
    mockValidators.two.mockImplementationOnce(() => true);
    expect(controller.isAllValid()).toBe(false);
    controller.validate("one", "test1");
    controller.validate("two", "test2");
    expect(controller.isAllValid()).toBe(true);
  });
});
