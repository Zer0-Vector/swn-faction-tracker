import React from "react";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { AuthContext } from "../../../contexts/AuthContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { LoginStates } from "../../../types/LoginState";
import { ProvidedAuth } from "../../../types/ProvidedAuth";

import { PasswordResetDialog } from "./PasswordResetDialog";

const mockSend = jest.fn();

const mockSetLoginState = jest.fn();
function renderIt() {
  render(
    <AuthContext.Provider value={{
      sendPasswordResetEmail: mockSend as (e: string)=>Promise<void>,
    } as ProvidedAuth}>
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
    </AuthContext.Provider>
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
    const message = within(dialog).getByTestId("message-dialog-message");
    expect(message).toHaveTextContent("email");
  });

  it('OK disabled on blank field', () => {
    renderIt();
    const dialog = screen.getByTestId("password-reset-dialog");
    const ok = within(dialog).getByText("OK");
    expect(ok).toBeInstanceOf(HTMLButtonElement);
    expect(ok).toBeDisabled();
  });

  it('sends password reset email with valid email input', async () => {
    mockSend.mockReturnValue(Promise.resolve());
    renderIt();
    const dialog = screen.getByTestId("password-reset-dialog");
    const ok = within(dialog).getByText("OK");
    const textfield = within(dialog).getByTestId("email-textfield");
    expect(textfield).toBeInstanceOf(HTMLDivElement);
    // eslint-disable-next-line testing-library/no-node-access
    const input = textfield.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(ok).toBeDisabled();
    fireEvent.change(input, { target: { value: "email@somewhere.com" } });
    expect(ok).not.toBeDisabled();
    fireEvent.click(ok);
    await waitFor(() => expect(mockSend).toBeCalledTimes(1));
    expect(mockSetLoginState).toBeCalledWith("PASSWORD_RESET_SENT");
  });

  it('if send password reset email fails, set state', async () => {
    mockSend.mockReturnValue(Promise.reject());
    renderIt();
    const dialog = screen.getByTestId("password-reset-dialog");
    const ok = within(dialog).getByText("OK");
    const textfield = within(dialog).getByTestId("email-textfield");
    expect(textfield).toBeInstanceOf(HTMLDivElement);
    // eslint-disable-next-line testing-library/no-node-access
    const input = textfield.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(ok).toBeDisabled();
    fireEvent.change(input, { target: { value: "email@somewhere.com" } });
    expect(ok).not.toBeDisabled();
    fireEvent.click(ok);
    await waitFor(() => expect(mockSend).toBeCalledTimes(1));
    expect(mockSetLoginState).toBeCalledWith("PASSWORD_RESET_ERROR");
  });

  it('returns to login on cancel click', () => {
    renderIt();
    const dialog = screen.getByTestId("password-reset-dialog");
    const cancel = within(dialog).getByText("Cancel");
    expect(cancel).toBeInstanceOf(HTMLButtonElement);
    expect(cancel).not.toBeDisabled();
    fireEvent.click(cancel);
    expect(mockSetLoginState).toBeCalledWith("LOGGING_IN");
  });
});
