import React from "react";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { AuthContext } from "../../../contexts/AuthContext";
import { UiStateContext, UiStateContextType } from "../../../contexts/UiStateContext";
import { LoginStateSetter } from "../../../controllers/UiStateController";
import { LoginStates } from "../../../types/LoginState";
import { ProvidedAuth } from "../../../types/ProvidedAuth";
import UiState from "../../../types/UiState";

import LogoutConfirmDialog from "./LogoutConfirmDialog";
import { beforeEach, describe, expect, it, vi } from "vitest";


const mockSetLoginState = vi.fn();
const mockLogout = vi.fn();
const mockAuth = {
  logout: mockLogout as ()=>Promise<void>,
} as ProvidedAuth;

function renderIt() {
  render(
    <AuthContext.Provider value={mockAuth}>
      <UiStateContext.Provider value={{
        state: {
          loginState: "LOGGING_OUT",
        } as UiState,
        controller: {
          setLoginState: mockSetLoginState as LoginStateSetter,
        },
      } as UiStateContextType}>
        <LogoutConfirmDialog />
      </UiStateContext.Provider>
    </AuthContext.Provider>
  );
}

describe('LogoutConfirmDialog', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  })

  it.each(
    [...LoginStates.filter(s => s !== "LOGGING_OUT")]
  )('does not render when LoginState != "LOGGING_OUT"', (loginState) => {
    render(
      <UiStateContext.Provider value={{
        state: {
          loginState: loginState,
        },
        controller: {},
      } as UiStateContextType}>
        <LogoutConfirmDialog />
      </UiStateContext.Provider>
    );
    const dialog = screen.queryByTestId("logout-confirmation");
    expect(dialog).not.toBeInTheDocument();
  });
  it('renders when LoginState = "LOGGING_OUT"', () => {
    render(
      <UiStateContext.Provider value={{
        state: {
          loginState: "LOGGING_OUT",
        },
        controller: {},
      } as UiStateContextType}>
        <LogoutConfirmDialog />
      </UiStateContext.Provider>
    );
    const dialog = screen.queryByTestId("logout-confirmation");
    expect(dialog).toBeInTheDocument();
  });

  it('calls controller on logout', async () => {
    mockLogout.mockResolvedValueOnce(null); // void function
    renderIt();
    const dialog = screen.getByTestId("logout-confirmation");
    const confirm = within(dialog).getByText("Logout");
    expect(confirm).toBeInstanceOf(HTMLButtonElement);
    fireEvent.click(confirm);
    await waitFor(() => expect(mockSetLoginState).toBeCalledWith("LOGGED_OUT"));
    expect(mockLogout).toBeCalledTimes(1);
  });

  it('calls controller on cancel', async () => {
    renderIt();
    const dialog = screen.getByTestId("logout-confirmation");
    const cancel = within(dialog).getByText("Cancel");
    expect(cancel).toBeInstanceOf(HTMLButtonElement);
    fireEvent.click(cancel);
    await waitFor(() => expect(mockSetLoginState).toBeCalledWith("LOGGED_IN"));
  });

  it('stays logged in when logout fails', async () => {
    mockLogout.mockRejectedValueOnce("fake-error");
    renderIt();
    const dialog = screen.getByTestId("logout-confirmation");
    const confirm = within(dialog).getByText("Logout");
    expect(confirm).toBeInstanceOf(HTMLButtonElement);
    fireEvent.click(confirm);
    await waitFor(() => expect(mockSetLoginState).toBeCalledWith("LOGGED_IN"));
    expect(mockLogout).toBeCalledTimes(1);
  });
});

