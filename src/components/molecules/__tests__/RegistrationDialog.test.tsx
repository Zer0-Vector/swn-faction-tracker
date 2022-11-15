import React from "react";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";

import { render, screen } from "@testing-library/react";

import { UiStateContext, UiStateContextType } from "../../../contexts/UiStateContext";
import RegistrationDialog from "../RegistrationDialog";

function renderOpened() {
  render(
    <UiStateContext.Provider value={
      {
        state: {
          loginState: "REGISTERING",
        },
        controller: {},
      } as UiStateContextType
    }>
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
    expect(cancelButton).toHaveTextContent("Cancel");
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

  it.todo('register button enables when fields are non-empty and passwords match');

  it.todo('password and confirm fields are error highlighted when passwords do not match');

  it.todo('creates a user on submit with valid email and matching passwords');
});
