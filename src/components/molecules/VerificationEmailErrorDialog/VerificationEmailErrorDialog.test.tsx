import React from "react";
import { Auth, getAuth, signOut } from "firebase/auth";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import LoginState, { LoginStates } from "../../../types/LoginState";
import UiState from "../../../types/UiState";
import VerificationEmailErrorDialog from "../VerificationEmailErrorDialog";

jest.mock("firebase/auth");

const mockGetAuth = getAuth as jest.MockedFn<typeof getAuth>;
const mockSignOut = signOut as jest.MockedFn<typeof signOut>;

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
  
  it.each(
    [[undefined], [{}]]
  )('sets LoginState to LOGGED_OUT after close (w/ user=%p)', async (mockUser) => {
    const mockContext = {
      state: {
        loginState: "VERIFICATION_ERROR",
      } as UiState,
      controller: {
        setLoginState: jest.fn() as (state: LoginState)=>void,
      } as UiStateController,
    };

    mockGetAuth.mockImplementationOnce(() => (
      {
        currentUser: mockUser
      } as Auth
    ));
    mockSignOut.mockImplementationOnce(() => Promise.resolve());

    render(
      <UiStateContext.Provider value={mockContext}>
        <VerificationEmailErrorDialog />
      </UiStateContext.Provider>
    );
    const button = screen.getByTestId("verification-error-dialog-close-button");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    await waitFor(() => expect(mockContext.controller.setLoginState).toBeCalledTimes(1));
    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGGED_OUT");
  });
});
