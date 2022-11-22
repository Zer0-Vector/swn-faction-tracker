import UiState from "../types/UiState";

import { UiStateController } from "./UiStateController";

let controller: UiStateController;

const mockSetter = jest.fn();

describe("UiStateController", () => {
  beforeEach(() => {
    controller = new UiStateController(mockSetter);
  });

  it('sets login state', () => {
    controller.setLoginState("LOGGED_IN");
    expect(mockSetter).toBeCalledTimes(1);
    const setter = mockSetter.mock.calls[0][0] as (prev: UiState)=>UiState;
    const result = setter({} as UiState);
    expect(result.loginState).toEqual("LOGGED_IN");
  });
});