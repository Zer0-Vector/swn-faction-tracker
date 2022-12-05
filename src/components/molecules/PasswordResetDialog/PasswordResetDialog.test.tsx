import React from "react";

import { render, screen, within } from "@testing-library/react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { LoginStates } from "../../../types/LoginState";

import { PasswordResetDialog } from "./PasswordResetDialog";

const mockSetLoginState = jest.fn();
function renderIt() {
  render(
    <UiStateContext.Provider value={{
      state: {
        loginState: "RESETTING_PASSWORD",
      },
      controller: {
        setLoginState: mockSetLoginState,
      },
    }}>
      <PasswordResetDialog />
    </UiStateContext.Provider>
  );
}

describe('PasswordResetDialog', () => {
  it.each(
    [...LoginStates.filter(s => s !== "RESETTING_PASSWORD")]
  )('does not show when LoginState=%p', (ls) => {
    render(
      <UiStateContext.Provider value={{
        state: {
          loginState: ls,
        },
        controller: {
          setLoginState: mockSetLoginState,
        },
      }}>
        <PasswordResetDialog />
      </UiStateContext.Provider>
    );
    const dialog = screen.queryByTestId("password-reset-dialog");
    expect(dialog).not.toBeInTheDocument();
  });

  it('shows when LoginState="RESETTING_PASSWORD"', () => {
    renderIt();
    const dialog = screen.getByTestId("password-reset-dialog");
    expect(dialog).toBeInTheDocument();
  });
  
  it('asks for email', () => {
    renderIt();
    const dialog = screen.getByTestId("password-reset-dialog");
    const message = within(dialog).getByTestId("message");
    expect(message).toHaveTextContent("email");
  });

  it.todo('OK disabled on blank field');
  it.todo('sends password reset email with valid email input');
  it.todo('closes dialog on cancel click');
});
