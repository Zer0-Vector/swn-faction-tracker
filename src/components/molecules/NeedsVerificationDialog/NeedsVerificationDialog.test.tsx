import React from "react";
import { Auth, getAuth, sendEmailVerification, signOut, User } from "firebase/auth";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { UiStateContext, UiStateContextType } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import LoginState, { LoginStates } from "../../../types/LoginState";
import UiState from "../../../types/UiState";
import NeedsVerificationDialog from "../NeedsVerificationDialog";

jest.mock("firebase/app");
jest.mock("firebase/analytics");
jest.mock("firebase/auth");

const mockGetAuth = getAuth as jest.MockedFn<typeof getAuth>;
const mockSignOut = signOut as jest.MockedFn<typeof signOut>;
const mockSendEmailVerification = sendEmailVerification as jest.MockedFn<typeof sendEmailVerification>;

const mockContext = {
  state: {
    loginState: "NEEDS_VERIFICATION",
  } as UiState,
  controller: {
    setLoginState: jest.fn((state: LoginState) => {
      console.debug("mockContext.controller.setLoginState: ", state);
    }) as (state: LoginState)=>void,
  },
} as UiStateContextType;
function renderOpened() {
  render(
    <UiStateContext.Provider value={mockContext}>
      <NeedsVerificationDialog />
    </UiStateContext.Provider>
  );
}

describe('<NeedsVerificationDialog />', () => {
  it.each(
    [...LoginStates].filter(s => s !== "REGISTERED" && s !== "NEEDS_VERIFICATION")
  )('is not rendered when LoginState=%p', s => {
    render(
      <UiStateContext.Provider value={{
        state: {
          loginState: s,
        } as UiState,
        controller: {} as UiStateController,
      }}>
        <NeedsVerificationDialog />
      </UiStateContext.Provider>
    );
    expect(screen.queryByTestId("verification-dialog")).not.toBeInTheDocument();
  });

  it.each(
    ["NEEDS_VERIFICATION", "REGISTERED"] as LoginState[]
  )('opens when LoginState=%p', s => {
    render(
      <UiStateContext.Provider value={{
        state: {
          loginState: s,
        } as UiState,
        controller: {} as UiStateController,
      }}>
        <NeedsVerificationDialog />
      </UiStateContext.Provider>
    );
    expect(screen.getByTestId("verification-dialog")).toBeInTheDocument();
  });

  it('renders resend link', () => {
    renderOpened();
    expect(screen.getByTestId("verification-dialog-resend-link")).toBeInTheDocument();
  });

  it('sends verification email when link.click', () => {
    renderOpened();
    mockGetAuth.mockImplementationOnce(() => {
      return {
        currentUser: {} as User,
      } as Auth;
    });
    mockSendEmailVerification.mockImplementationOnce(() => Promise.resolve());
    
    const link = screen.getByTestId("verification-dialog-resend-link");
    fireEvent.click(link);
    expect(mockGetAuth).toBeCalledTimes(1);
    expect(mockSendEmailVerification).toBeCalledTimes(1);
  });
  
  it('LoginState=VERIFICATION_ERROR when sendEmailVerification fails', async () => {
    renderOpened();
    mockGetAuth.mockImplementationOnce(() => {
      return {
        currentUser: {} as User,
      } as Auth;
    });
    mockSendEmailVerification.mockImplementationOnce(() => Promise.reject());
    
    const link = screen.getByTestId("verification-dialog-resend-link");
    fireEvent.click(link);
    expect(mockGetAuth).toBeCalledTimes(1);
    expect(mockSendEmailVerification).toBeCalledTimes(1);
    await waitFor(() => expect(mockContext.controller.setLoginState).toBeCalledTimes(1));
    expect(mockContext.controller.setLoginState).toBeCalledWith("VERIFICATION_ERROR");
  });

  it('signs out when on close button clicked', async () => {
    renderOpened();
    mockSignOut.mockImplementationOnce(() => Promise.resolve());
    const dialog = screen.getByTestId("verification-dialog");
    const closeButton = within(dialog).getByTestId("message-dialog-close-button");
    fireEvent.click(closeButton);
    expect(mockSignOut).toBeCalledTimes(1);
    await waitFor(() => expect(mockContext.controller.setLoginState).toBeCalledTimes(1));
    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGGED_OUT");
  });
  
  it('stays logged in if signout fails', async () => {
    renderOpened();
    mockSignOut.mockImplementationOnce(() => Promise.reject());
    const dialog = screen.getByTestId("verification-dialog");
    const closeButton = within(dialog).getByTestId("message-dialog-close-button");
    fireEvent.click(closeButton);
    expect(mockSignOut).toBeCalledTimes(1);
    await waitFor(() => expect(mockContext.controller.setLoginState).toBeCalledTimes(1));
    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGGED_IN");
  });
});
