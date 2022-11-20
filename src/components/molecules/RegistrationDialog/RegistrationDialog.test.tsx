import React from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, User, UserCredential } from "firebase/auth";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { UiStateContext, UiStateContextType } from "../../../contexts/UiStateContext";
import LoginState from "../../../types/LoginState";
import RegistrationDialog from "../RegistrationDialog";

jest.mock("firebase/app");
jest.mock("firebase/analytics");
jest.mock("firebase/auth");

const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.MockedFn<typeof createUserWithEmailAndPassword>;
const mockSendEmailVerification = sendEmailVerification as jest.MockedFn<typeof sendEmailVerification>;

const mockContext = {
  state: {
    loginState: "REGISTERING",
  },
  controller: {
    setLoginState: jest.fn((state: LoginState) => {
      console.debug("TEST_LOGIN_STATE: ", state);
    }) as (state: LoginState) => void,
  },
} as UiStateContextType;

function renderOpened() {
  render(
    <UiStateContext.Provider value={mockContext}>
      <RegistrationDialog />
    </UiStateContext.Provider>
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
    mockCreateUserWithEmailAndPassword.mockImplementationOnce(() => Promise.resolve({ user: { emailVerified: false } as User } as UserCredential));
    mockSendEmailVerification.mockImplementationOnce(() => Promise.resolve());
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
    expect(mockSendEmailVerification).toBeCalledTimes(1);
    expect(mockCreateUserWithEmailAndPassword).toBeCalledWith(undefined, "a@b.c", "123");
    expect(mockSendEmailVerification).toBeCalledWith(expect.anything());
    expect(mockContext.controller.setLoginState).toBeCalledWith("REGISTERED");
  });

  it('on register error shows error message', async () => {
    mockCreateUserWithEmailAndPassword.mockImplementationOnce(() => Promise.reject({ code: "testing-123" }));
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
    expect(mockContext.controller.setLoginState).toBeCalledTimes(2);
    const errorMessage = screen.getByTestId("registration-dialog-error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Error");
    expect(errorMessage).toHaveTextContent("testing-123");
  });

  it.todo('handles error with send email verification');
});
