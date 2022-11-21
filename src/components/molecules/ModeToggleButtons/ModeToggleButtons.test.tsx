import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { THEME } from "../../../style/Theme";
import RuntimeGameState, { IGameState } from "../../../types/RuntimeGameState";
import ModeToggleButtons from "../ModeToggleButtons";

// enable tests when UI uses mode
describe('default ModeToggleButtons', () => {
  it.skip('value is from context', () => {
    const mockGameContext = {
      state: { mode: "TURN" } as IGameState,
      controller: { setMode: jest.fn() } as unknown as RuntimeGameState,
    } as GameContextType;

    render(
      <ThemeProvider theme={THEME}> {/* needed since it's using custom colors */}
        <GameContext.Provider value={mockGameContext}>
          <ModeToggleButtons />
        </GameContext.Provider>
      </ThemeProvider>
    );

    const btnTurn = screen.getByText("Take Turn");
    expect(btnTurn).toHaveClass("Mui-selected");

    const btnEdit = screen.getByText("Free Edit");
    expect(btnEdit).not.toHaveClass("Mui-selected");

    const btnView = screen.getByText("View");
    expect(btnView).not.toHaveClass("Mui-selected");
  });

  it.skip('calls setMode when clicked', () => {
    const mockGameContext = {
      state: { mode: "EDIT" } as IGameState,
      controller: { setMode: jest.fn() } as unknown as RuntimeGameState,
    } as GameContextType;

    render(
      <ThemeProvider theme={THEME}> {/* needed since it's using custom colors */}
        <GameContext.Provider value={mockGameContext}>
          <ModeToggleButtons />
        </GameContext.Provider>
      </ThemeProvider>
    );

    const btnView = screen.getByText("View");
    fireEvent.click(btnView);
    expect(mockGameContext.controller.setMode).toBeCalledTimes(1);
    expect(mockGameContext.controller.setMode).toBeCalledWith("VIEW");
    jest.resetAllMocks();
    
    const btnTurn = screen.getByText("Take Turn");
    fireEvent.click(btnTurn);
    expect(mockGameContext.controller.setMode).toBeCalledTimes(1);
    expect(mockGameContext.controller.setMode).toBeCalledWith("TURN");
    jest.resetAllMocks();
    
    const btnEdit = screen.getByText("Free Edit");
    fireEvent.click(btnEdit);
    // clicking currently selected sends null to handler; controller is not called.
    expect(mockGameContext.controller.setMode).not.toBeCalledWith("EDIT");
  });
}); 
