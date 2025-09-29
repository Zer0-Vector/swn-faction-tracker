import React from "react";
import { User } from "firebase/auth";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { AuthContext } from "../../../contexts/AuthContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import LoginState, { LoginStates } from "../../../types/LoginState";
import { ProvidedAuth } from "../../../types/ProvidedAuth";
import UiState from "../../../types/UiState";
import VerificationEmailErrorDialog from "../VerificationEmailErrorDialog";
import { describe, expect, it, vi } from "vitest";

describe('VerificationEmailErrorDialog', () => {
  it.each(
    [...LoginStates].filter(s => s !== "VERIFICATION_ERROR")
  )('is not rendered when LoginState=%p', s => {
    render(
      <UiStateContext.Provider value={{
        state: {
          loginState: s,
        } as UiState,
        controller: {} as UiStateController,
      }}>
        <VerificationEmailErrorDialog />
      </UiStateContext.Provider>
    );
    expect(screen.queryByTestId("verification-error-dialog")).not.toBeInTheDocument();
  });

  it('opens when LoginState="VERIFICATION_ERROR"', () => {
    render(
      <UiStateContext.Provider value={{
        state: {
          loginState: "VERIFICATION_ERROR",
        } as UiState,
        controller: {} as UiStateController,
      }}>
        <VerificationEmailErrorDialog />
      </UiStateContext.Provider>
    );
    expect(screen.getByTestId("verification-error-dialog")).toBeInTheDocument();
  });

  it('sets LoginState to LOGGED_OUT after close (w/ user={})', async () => {
    const mockContext = {
      state: {
        loginState: "VERIFICATION_ERROR",
      } as UiState,
      controller: {
        setLoginState: vi.fn() as (state: LoginState)=>void,
      } as UiStateController,
    };
    const mockLogout = vi.fn()
    const mockAuth = {
      currentUser: {} as User,
      logout: mockLogout as ()=>Promise<void>,
    } as ProvidedAuth;
    mockLogout.mockResolvedValueOnce(null); // void function

    render(
      <AuthContext.Provider value={mockAuth}>
        <UiStateContext.Provider value={mockContext}>
          <VerificationEmailErrorDialog />
        </UiStateContext.Provider>
      </AuthContext.Provider>
    );
    const dialog = screen.getByTestId("verification-error-dialog");
    const button = within(dialog).getByTestId("message-dialog-close-button");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    await waitFor(() => expect(mockContext.controller.setLoginState).toBeCalledTimes(2));
    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGGED_OUT");
  });
});
