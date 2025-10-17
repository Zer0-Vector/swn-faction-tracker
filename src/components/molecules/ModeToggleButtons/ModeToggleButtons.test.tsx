import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  UiStateContext,
  UiStateContextType,
} from "../../../contexts/UiStateContext";
import {
  EditModeSetter,
  UiStateController,
} from "../../../controllers/UiStateController";
import { THEME } from "../../../style/Theme";
import UiState from "../../../types/UiState";
import ModeToggleButtons from "../ModeToggleButtons";
import { describe, expect, it, vi } from "vitest";

// enable tests when UI uses mode
describe("default ModeToggleButtons", () => {
  it("value is from context", () => {
    const mockContext = {
      state: { editMode: "TURN" },
      controller: { setEditMode: vi.fn() as EditModeSetter },
    } as UiStateContextType;

    render(
      <ThemeProvider theme={THEME}>
        {" "}
        {/* needed since it's using custom colors */}
        <UiStateContext.Provider value={mockContext}>
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

  it.todo("calls setEditMode when %p is clicked");
  it.todo("does not call setEditMode when clicking selected value");

  // remove this when the above are implemented
  it("calls setEditMode when clicked", () => {
    const mockFactionContext = {
      state: { editMode: "EDIT" } as UiState,
      controller: {
        setEditMode: vi.fn() as EditModeSetter,
      } as UiStateController,
    } as UiStateContextType;

    render(
      <ThemeProvider theme={THEME}>
        {" "}
        {/* needed since it's using custom colors */}
        <UiStateContext.Provider value={mockFactionContext}>
          <ModeToggleButtons />
        </UiStateContext.Provider>
      </ThemeProvider>
    );

    const btnView = screen.getByText("View");
    expect(btnView).not.toBeDisabled();
    fireEvent.click(btnView);
    expect(mockFactionContext.controller.setEditMode).toBeCalledTimes(1);
    expect(mockFactionContext.controller.setEditMode).toBeCalledWith("VIEW");
    vi.resetAllMocks();

    // const btnTurn = screen.getByText("Take Turn");
    // expect(btnTurn).not.toBeDisabled();
    // fireEvent.click(btnTurn);
    // expect(mockFactionContext.controller.setEditMode).toBeCalledTimes(1);
    // expect(mockFactionContext.controller.setEditMode).toBeCalledWith("TURN");
    // vi.resetAllMocks();

    const btnEdit = screen.getByText("Free Edit");
    expect(btnEdit).not.toBeDisabled();
    fireEvent.click(btnEdit);
    // clicking currently selected sends null to handler; controller is not called.
    expect(mockFactionContext.controller.setEditMode).not.toBeCalledWith(
      "EDIT"
    );
  });
});
