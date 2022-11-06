import { GameController } from "."

it('new GameController does not crash', () => {
  const mockSetState = jest.fn();
  const controller = new GameController(mockSetState);
  expect(controller).toBeDefined();
  expect(typeof controller).toBe("object");
});
