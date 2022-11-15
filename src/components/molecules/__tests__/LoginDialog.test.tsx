import React from "react";
import { setPersistence, signInWithEmailAndPassword, User, UserCredential } from "firebase/auth";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { UiStateContext, UiStateContextType } from "../../../contexts/UiStateContext";
import LoginState from "../../../types/LoginState";
import UiState from "../../../types/UiState";
import LoginDialog from "../LoginDialog";

jest.mock("firebase/app");
jest.mock("firebase/analytics");
jest.mock("firebase/auth");

const mockSetPersistence = setPersistence as jest.MockedFn<typeof setPersistence>;
const mockSignIn = signInWithEmailAndPassword as jest.MockedFn<typeof signInWithEmailAndPassword>;

//   getAuth: () => ({} as FBAuth.Auth),
//   signInWithEmailAndPassword: () => Promise.resolve({ user: {} as FBAuth.User } as FBAuth.UserCredential),
// TODO define mockSignIn so it can be change to fail login

const mockContext = {
  state: {
    loginState: "LOGGING_IN",
  } as UiState,
  controller: {
    setLoginState: jest.fn(state => {
      console.log("TEST SET_LOGIN_STATE: ", state);
    }) as (state:LoginState) => void,
  },
} as UiStateContextType;

function renderOpened() {
  render(
    <UiStateContext.Provider value={mockContext}>
      <LoginDialog />
    </UiStateContext.Provider>
  );
}

describe('default LoginDialog', () => {
  beforeEach(() => {
    mockSetPersistence.mockImplementationOnce(() => Promise.resolve());
  });

  it('displays nothing when not open', () => {
    render(
      <UiStateContext.Provider value={
        { 
          state: {},
          controller: {},
        } as UiStateContextType
      }>
        <LoginDialog />
      </UiStateContext.Provider>
    );
    expect(screen.queryByTestId("login-dialog")).not.toBeInTheDocument();
  });

  it('displays dialog with buttons and TextFields when open', () => {
    renderOpened();
    const loginDialog = screen.getByTestId("login-dialog");
    expect(loginDialog).toBeInTheDocument();
    
    const loginButton = screen.getByTestId("login-dialog-login-button");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeInstanceOf(HTMLButtonElement);
    expect(loginButton).toHaveTextContent("Login");
    expect(loginButton.getAttribute("type")).toBe("submit");
    expect(loginButton).toBeDisabled();
    
    const cancelButton = screen.getByTestId("login-dialog-cancel-button");
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeInstanceOf(HTMLButtonElement);
    expect(cancelButton).toHaveTextContent("Cancel");
    expect(cancelButton.getAttribute("type")).toBe("button");

    const emailDiv = screen.getByTestId("login-dialog-email-field");
    expect(emailDiv).toBeInTheDocument();
    expect(emailDiv).toBeInstanceOf(HTMLDivElement);

    const emailField = screen.getByLabelText("Email");
    expect(emailField).toBeInTheDocument();
    expect(emailField).toBeInstanceOf(HTMLInputElement);
    expect(emailField).toHaveValue("");
    
    const passwordDiv = screen.getByTestId("login-dialog-password-field");
    expect(passwordDiv).toBeInTheDocument();
    expect(passwordDiv).toBeInstanceOf(HTMLDivElement);

    const passwordField = screen.getByLabelText("Password");
    expect(passwordField).toBeInTheDocument();
    expect(passwordField).toBeInstanceOf(HTMLInputElement);
    expect(passwordField).toHaveValue("");
  });

  it('sets login state on cancel', () => {
    renderOpened();
    const cancelButton = screen.getByTestId("login-dialog-cancel-button");
    fireEvent.click(cancelButton);
    expect(mockContext.controller.setLoginState).toBeCalledTimes(1);
    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGGED_OUT");
  });

  it('login button enabled after entering credentials', () => {
    renderOpened();
    const emailField = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordField = screen.getByLabelText("Password") as HTMLInputElement;
    const loginButton = screen.getByTestId("login-dialog-login-button");

    fireEvent.input(emailField, { target: { value: "a@b.c" } });
    fireEvent.input(passwordField, { target: { value: "123" } });

    expect(loginButton).not.toBeDisabled();
  });

  it('after login click with verified credentails, LoginState=LOGGED_IN', async () => {
    mockSignIn.mockImplementationOnce(() => Promise.resolve({ user: { emailVerified: true } as User } as UserCredential));
    renderOpened();
    const emailField = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordField = screen.getByLabelText("Password") as HTMLInputElement;
    const loginButton = screen.getByTestId("login-dialog-login-button");

    fireEvent.input(emailField, { target: { value: "a@b.c" } });
    fireEvent.input(passwordField, { target: { value: "123" } });
    fireEvent.click(loginButton);

    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGIN_WAITING");
    await waitFor(() => expect(mockContext.controller.setLoginState).toBeCalledTimes(2));
    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGGED_IN");
  });

  it('after login with unverified credentials, LoginState=NEEDS_VERIFICATION', async () => {
    mockSignIn.mockImplementationOnce(() => Promise.resolve({ user: { emailVerified: false } as User } as UserCredential));
    renderOpened();
    const emailField = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordField = screen.getByLabelText("Password") as HTMLInputElement;
    const loginButton = screen.getByTestId("login-dialog-login-button");

    fireEvent.input(emailField, { target: { value: "a@b.c" } });
    fireEvent.input(passwordField, { target: { value: "123" } });
    fireEvent.click(loginButton);

    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGIN_WAITING");
    await waitFor(() => expect(mockContext.controller.setLoginState).toBeCalledTimes(2));
    expect(mockContext.controller.setLoginState).toBeCalledWith("NEEDS_VERIFICATION");
  });

  it('after failed login, LoginState=LOGGING_IN with error message', async () => {
    mockSignIn.mockImplementationOnce(() => Promise.reject({ code: "testing" }));
    renderOpened();
    const emailField = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordField = screen.getByLabelText("Password") as HTMLInputElement;
    const loginButton = screen.getByTestId("login-dialog-login-button");
    expect(screen.queryByTestId("login-dialog-error-message")).not.toBeInTheDocument();

    fireEvent.input(emailField, { target: { value: "a@b.c" } });
    fireEvent.input(passwordField, { target: { value: "123" } });
    fireEvent.click(loginButton);

    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGIN_WAITING");
    await waitFor(() => expect(mockContext.controller.setLoginState).toBeCalledTimes(2));
    expect(mockContext.controller.setLoginState).toBeCalledWith("LOGGING_IN");
    const errorMessage = screen.getByTestId("login-dialog-error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("error");
  });
});
