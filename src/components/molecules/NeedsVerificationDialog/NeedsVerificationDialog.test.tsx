import React from "react";
import { User } from "firebase/auth";

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import { AuthContext } from "../../../contexts/AuthContext";
import {
  UiStateContext,
  UiStateContextType,
} from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import LoginState, { LoginStates } from "../../../types/LoginState";
import { ProvidedAuth } from "../../../types/ProvidedAuth";
import UiState from "../../../types/UiState";
import NeedsVerificationDialog from "../NeedsVerificationDialog";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockContext = {
  state: {
    loginState: "NEEDS_VERIFICATION",
  } as UiState,
  controller: {
    setLoginState: vi.fn((state: LoginState) => {
      console.debug("mockContext.controller.setLoginState: ", state);
    }) as (state: LoginState) => void,
  },
} as UiStateContextType;

const mockSendEmailVerification = vi.fn();
const mockLogout = vi.fn();
const mockAuth = {
  logout: mockLogout as () => Promise<void>,
  sendEmailVerification: mockSendEmailVerification as (
    u: User
  ) => Promise<void>,
} as ProvidedAuth;

function renderOpened() {
  render(
    <AuthContext.Provider value={mockAuth}>
      <UiStateContext.Provider value={mockContext}>
        <NeedsVerificationDialog />
      </UiStateContext.Provider>
    </AuthContext.Provider>
  );
}

describe("<NeedsVerificationDialog />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.currentUser = null;
  });

  it.each(
    [...LoginStates].filter(
      (s) => s !== "REGISTERED" && s !== "NEEDS_VERIFICATION"
    )
  )("is not rendered when LoginState=%p", (s) => {
    render(
      <UiStateContext.Provider
        value={{
          state: {
            loginState: s,
          } as UiState,
          controller: {} as UiStateController,
        }}
      >
        <NeedsVerificationDialog />
      </UiStateContext.Provider>
    );
    expect(screen.queryByTestId("verification-dialog")).not.toBeInTheDocument();
  });

  it.each(["NEEDS_VERIFICATION", "REGISTERED"] as LoginState[])(
    "opens when LoginState=%p",
    (s) => {
      render(
        <UiStateContext.Provider
          value={{
            state: {
              loginState: s,
            } as UiState,
            controller: {} as UiStateController,
          }}
        >
          <NeedsVerificationDialog />
        </UiStateContext.Provider>
      );
      expect(screen.getByTestId("verification-dialog")).toBeInTheDocument();
    }
  );

  it("renders resend link", () => {
    renderOpened();
    expect(
      screen.getByTestId("verification-dialog-resend-link")
    ).toBeInTheDocument();
  });

  it("sends verification email when link.click", () => {
    mockAuth.currentUser = {} as User;
    renderOpened();
    mockSendEmailVerification.mockImplementationOnce(() => Promise.resolve());

    const link = screen.getByTestId("verification-dialog-resend-link");
    fireEvent.click(link);
    expect(mockSendEmailVerification).toBeCalledTimes(1);
  });

  it("LoginState=VERIFICATION_ERROR when sendEmailVerification fails", async () => {
    mockAuth.currentUser = {} as User;
    renderOpened();
    mockSendEmailVerification.mockImplementationOnce(() => Promise.reject());

    const link = screen.getByTestId("verification-dialog-resend-link");
    fireEvent.click(link);
    expect(mockSendEmailVerification).toBeCalledTimes(1);
    await waitFor(() =>
      expect(mockContext.controller.setLoginState).toBeCalledTimes(1)
    );
    expect(mockContext.controller.setLoginState).toBeCalledWith(
      "VERIFICATION_ERROR"
    );
  });

  it("signs out when on close button clicked", async () => {
    renderOpened();
    mockLogout.mockImplementationOnce(() => Promise.resolve());
    const dialog = screen.getByTestId("verification-dialog");
    const closeButton = within(dialog).getByTestId(
      "message-dialog-close-button"
    );
    fireEvent.click(closeButton);
    expect(mockLogout).toBeCalledTimes(1);
    await waitFor(() =>
      expect(mockContext.controller.setLoginState).toBeCalledTimes(1)
    );
    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGGED_OUT");
  });

  it("stays logged in if signout fails", async () => {
    renderOpened();
    mockLogout.mockImplementationOnce(() => Promise.reject());
    const dialog = screen.getByTestId("verification-dialog");
    const closeButton = within(dialog).getByTestId(
      "message-dialog-close-button"
    );
    fireEvent.click(closeButton);
    expect(mockLogout).toBeCalledTimes(1);
    await waitFor(() =>
      expect(mockContext.controller.setLoginState).toBeCalledTimes(1)
    );
    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGGED_IN");
  });
});
