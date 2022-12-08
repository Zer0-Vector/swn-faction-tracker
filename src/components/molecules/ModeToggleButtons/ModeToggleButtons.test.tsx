import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";

import { UiStateContext, UiStateContextType } from "../../../contexts/UiStateContext";
import { LoginStateSetter } from "../../../controllers/UiStateController";
import { THEME } from "../../../style/Theme";
import ModeToggleButtons from "../ModeToggleButtons";

// enable tests when UI uses mode
describe('default ModeToggleButtons', () => {
  it('value is from context', () => {
    const mockGameContext = {
      state: { editMode: "TURN" },
      controller: { setEditMode: jest.fn() as LoginStateSetter },
    } as UiStateContextType;

    render(
      <ThemeProvider theme={THEME}> {/* needed since it's using custom colors */}
        <UiStateContext.Provider value={mockGameContext}>
          <ModeToggleButtons />
        </UiStateContext.Provider>
      </ThemeProvider>
    );

    const btnTurn = screen.getByText("Take Turn");
    expect(btnTurn).toHaveClass("Mui-selected");

    const btnEdit = screen.getByText("Free Edit");
    expect(btnEdit).not.toHaveClass("Mui-selected");

    const btnView = screen.getByText("View");
    expect(btnView).not.toHaveClass("Mui-selected");
  });

  it.todo('calls setEditMode when %p is clicked');
  it.todo('does not call setEditMode when clicking selected value');

  // remove this when the above are implemented
  it('calls setEditMode when clicked', () => {
    const mockGameContext = {
      state: { editMode: "EDIT" },
      controller: { setEditMode: jest.fn() as LoginStateSetter },
    } as UiStateContextType;

    render(
      <ThemeProvider theme={THEME}> {/* needed since it's using custom colors */}
        <UiStateContext.Provider value={mockGameContext}>
          <ModeToggleButtons />
        </UiStateContext.Provider>
      </ThemeProvider>
    );

    const btnView = screen.getByText("View");
    expect(btnView).not.toBeDisabled();
    fireEvent.click(btnView);
    expect(mockGameContext.controller.setEditMode).toBeCalledTimes(1);
    expect(mockGameContext.controller.setEditMode).toBeCalledWith("VIEW");
    jest.resetAllMocks();
    
    // const btnTurn = screen.getByText("Take Turn");
    // expect(btnTurn).not.toBeDisabled();
    // fireEvent.click(btnTurn);
    // expect(mockGameContext.controller.setEditMode).toBeCalledTimes(1);
    // expect(mockGameContext.controller.setEditMode).toBeCalledWith("TURN");
    // jest.resetAllMocks();
    
    const btnEdit = screen.getByText("Free Edit");
    expect(btnEdit).not.toBeDisabled();
    fireEvent.click(btnEdit);
    // clicking currently selected sends null to handler; controller is not called.
    expect(mockGameContext.controller.setEditMode).not.toBeCalledWith("EDIT");
  });
}); 
