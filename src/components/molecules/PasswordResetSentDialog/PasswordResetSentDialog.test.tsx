import React from "react";

import { render, screen } from "@testing-library/react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import LoginState, { LoginStates } from "../../../types/LoginState";
import UiState from "../../../types/UiState";

import { PasswordResetSentDialog } from "./PasswordResetSentDialog";

const mockSetLoginState = jest.fn();
function renderIt() {
  render(
    <UiStateContext.Provider value={{
      state: {
        loginState: "PASSWORD_RESET_SENT",
      } as UiState,
      controller: {
        setLoginState: mockSetLoginState as (s:LoginState)=>void,
      } as UiStateController,
    }}>
      <PasswordResetSentDialog />
    </UiStateContext.Provider>
  );
}

describe('PasswordResetSentDialog', () => {
  it.each(
    [...LoginStates.filter(s => s !== "PASSWORD_RESET_SENT")]
  )('is not shown when LoginState=%p', (state) => {
    render(
      <UiStateContext.Provider value={{
        state: {
          loginState: state,
        } as UiState,
        controller: {
          setLoginState: mockSetLoginState as (s:LoginState)=>void,
        } as UiStateController,
      }}>
        <PasswordResetSentDialog />
      </UiStateContext.Provider>
    );
    const dialog = screen.queryByTestId("reset-sent-dialog");
    expect(dialog).not.toBeInTheDocument();
  });
  
  it('is shown when LoginState="PASSWORD_RESET_SENT"', () => {
    renderIt();
    const dialog = screen.getByTestId("reset-sent-dialog");
    expect(dialog).toBeInTheDocument();
  });
});
