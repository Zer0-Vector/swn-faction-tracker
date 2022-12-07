import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { UiStateContext } from "../../../contexts/UiStateContext";

import { PasswordResetErrorDialog } from "./PasswordResetErrorDialog";

describe('PasswordResetErrorDialog', () => {
  it('returns to LoginState=LOGGING_IN after close', () => {
    const mockSetLoginState = jest.fn();
    render(
      <UiStateContext.Provider value={{
        state: {
          loginState: "PASSWORD_RESET_ERROR",
        },
        controller: {
          setLoginState: mockSetLoginState,
        },
      }}>
        <PasswordResetErrorDialog />
      </UiStateContext.Provider>
    );
    const dialog = screen.getByTestId("reset-error-dialog");
    expect(dialog).toBeInTheDocument();
    const ok = within(dialog).getByText("OK");
    expect(ok).toBeInstanceOf(HTMLButtonElement);
    fireEvent.click(ok);
    expect(mockSetLoginState).toBeCalledWith("LOGGING_IN");
    expect(mockSetLoginState).toBeCalledTimes(1);
  });
});
