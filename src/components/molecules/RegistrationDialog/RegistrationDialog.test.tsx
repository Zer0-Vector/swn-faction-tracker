import React from "react";
import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { AuthContext } from "../../../contexts/AuthContext";
import { UiStateContext, UiStateContextType } from "../../../contexts/UiStateContext";
import LoginState from "../../../types/LoginState";
import { ProvidedAuth } from "../../../types/ProvidedAuth";
import RegistrationDialog from "../RegistrationDialog";

const mockContext = {
  state: {
    loginState: "REGISTERING",
  },
  controller: {
    setLoginState: jest.fn() as (state: LoginState) => void,
  },
} as UiStateContextType;

const mockSignUp = jest.fn();
const mockSendEmailVerification = jest.fn();
const mockAuth = {
  signup: mockSignUp as (e: string, p: string)=>Promise<User>,
  sendEmailVerification: mockSendEmailVerification as ()=>Promise<void>,
} as ProvidedAuth;

function renderOpened() {
  render(
    <AuthContext.Provider value={mockAuth}>
      <UiStateContext.Provider value={mockContext}>
        <RegistrationDialog />
      </UiStateContext.Provider>
    </AuthContext.Provider>
  );
}

describe('default RegistrationDialog', () => {
  it('is hidden when not in valid registering state', () => {
    render(
      <UiStateContext.Provider value={{
        state: {},
        controller: {},
      } as UiStateContextType}>
        <RegistrationDialog />
      </UiStateContext.Provider>
    );
    expect(screen.queryByTestId("registration-dialog")).not.toBeInTheDocument();
  });
  
  it('is shown when in valid registration state', () => {
    renderOpened();
    expect(screen.getByTestId("registration-dialog")).toBeInTheDocument();
  });
  
  it('renders register and cancel buttons', () => {
    renderOpened();
    const registerButton = screen.getByTestId("registration-dialog-register-button");
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toBeInstanceOf(HTMLButtonElement);
    expect(registerButton).toHaveTextContent("Register");
    expect(registerButton.getAttribute("type")).toBe("submit");
    expect(registerButton).toBeDisabled();

    const cancelButton = screen.getByTestId("registration-dialog-cancel-button");
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeInstanceOf(HTMLButtonElement);
    expect(cancelButton).toHaveTextContent("Back");
  });

  it('renders email, password, and confirmation fields', () => {
    renderOpened();
    const emailField = screen.getByLabelText("Email");
    expect(emailField).toBeInTheDocument();

    const passwordField = screen.getByLabelText("Password");
    expect(passwordField).toBeInTheDocument();
    expect(passwordField.getAttribute("type")).toBe("password");

    const confirmField = screen.getByLabelText("Confirm Password");
    expect(confirmField).toBeInTheDocument();
    expect(confirmField.getAttribute("type")).toBe("password");
  });

  it('register button enables when fields are non-empty and passwords match', () => {
    renderOpened();
    const registerButton = screen.getByTestId("registration-dialog-register-button");
    expect(registerButton).toBeDisabled();

    const emailField = screen.getByLabelText("Email");
    const passwordField = screen.getByLabelText("Password");
    const confirmField = screen.getByLabelText("Confirm Password");

    fireEvent.input(emailField, { target: { value: "a@b.c" } });
    fireEvent.input(passwordField, { target: { value: "123" } });
    fireEvent.input(confirmField, { target: { value: "123" } });

    expect(registerButton).not.toBeDisabled();
  });

  it('password and confirm fields are error highlighted when passwords do not match', () => {
    renderOpened();

    const emailField = screen.getByLabelText("Email");
    const passwordField = screen.getByLabelText("Password");
    const confirmField = screen.getByLabelText("Confirm Password");

    // eslint-disable-next-line testing-library/no-node-access
    const passwordWrapper = passwordField.closest("div");
    // eslint-disable-next-line testing-library/no-node-access
    const confirmWrapper = confirmField.closest("div");

    expect(passwordWrapper).toBeInTheDocument();
    expect(confirmWrapper).toBeInTheDocument();
    expect(passwordWrapper).not.toHaveClass("Mui-error");
    expect(confirmWrapper).not.toHaveClass("Mui-error");

    fireEvent.input(emailField, { target: { value: "a@b.c" } });
    fireEvent.input(passwordField, { target: { value: "123" } });
    fireEvent.input(confirmField, { target: { value: "113" } });

    expect(passwordWrapper).toBeInTheDocument();
    expect(confirmWrapper).toBeInTheDocument();
    expect(passwordWrapper).toHaveClass("Mui-error");
    expect(confirmWrapper).toHaveClass("Mui-error");
  });

  it('creates a user on submit with valid email and matching passwords', async () => {
    mockSignUp.mockResolvedValueOnce({} as User);
    mockSendEmailVerification.mockResolvedValueOnce(null);
    renderOpened();

    const emailField = screen.getByLabelText("Email");
    const passwordField = screen.getByLabelText("Password");
    const confirmField = screen.getByLabelText("Confirm Password");
    const registerButton = screen.getByTestId("registration-dialog-register-button");

    fireEvent.input(emailField, { target: { value: "a@b.c" } });
    fireEvent.input(passwordField, { target: { value: "123" } });
    fireEvent.input(confirmField, { target: { value: "123" } });
    expect(registerButton).not.toBeDisabled();
    fireEvent.click(registerButton);

    expect(mockContext.controller.setLoginState).toBeCalledWith("REGISTER_WAITING");
    await waitFor(() => expect(mockContext.controller.setLoginState).toBeCalledTimes(2));
    expect(mockSignUp).toBeCalledTimes(1);
    expect(mockSignUp).toBeCalledWith("a@b.c", "123");
    expect(mockSendEmailVerification).toBeCalledTimes(1);
    expect(mockContext.controller.setLoginState).toBeCalledWith("REGISTERED");
  });

  it('on register error shows error message', async () => {
    mockSignUp.mockRejectedValueOnce(new FirebaseError("testing-123", "fake-error"));
    renderOpened();

    const emailField = screen.getByLabelText("Email");
    const passwordField = screen.getByLabelText("Password");
    const confirmField = screen.getByLabelText("Confirm Password");
    const registerButton = screen.getByTestId("registration-dialog-register-button");

    expect(screen.queryByTestId("registration-dialog-error-message")).not.toBeInTheDocument();

    fireEvent.input(emailField, { target: { value: "a@b.c" } });
    fireEvent.input(passwordField, { target: { value: "123" } });
    fireEvent.input(confirmField, { target: { value: "123" } });
    expect(registerButton).not.toBeDisabled();
    fireEvent.click(registerButton);

    expect(mockContext.controller.setLoginState).toBeCalledWith("REGISTER_WAITING");
    await waitFor(() => expect(mockContext.controller.setLoginState).toBeCalledWith("REGISTERING"));
    const errorMessage = screen.getByTestId("registration-dialog-error-message");
    expect(errorMessage).toHaveTextContent("testing-123");
  });

  it.todo('handles error with send email verification');
});
