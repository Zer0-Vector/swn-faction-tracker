import React from "react";
import { MemoryRouter, useLocation } from "react-router-dom";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { GameContext } from "../../../contexts/GameContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { IGameController } from "../../../controllers/GameController";
import { UiStateController } from "../../../controllers/UiStateController";
import FactionInfo from "../../../types/FactionInfo";
import { Maybe } from "../../../types/Maybe";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionListActionToolbar from "./FactionListActionToolbar";

function TestComp() {
  const { pathname } = useLocation();
  return (
    <UiStateContext.Provider value={{
      state: {
        editMode: "EDIT",
        loginState: "LOGGED_IN",
      },
      controller: {} as UiStateController,
    }}>
      <FactionListActionToolbar />
      <div data-testid="test-path">{pathname}</div>
    </UiStateContext.Provider>
  );
}

type GetFactionFunc = (id: string) => Maybe<FactionInfo>;
const mockGetFaction = jest.fn() as jest.MockedFn<GetFactionFunc>;
const mockRemoveFaction = jest.fn() as jest.MockedFn<(id: string)=>void>;
function renderIt(route = "/") {
  render(
    <GameContext.Provider value={{
      state: {
        getFactions: () => [] as FactionInfo[],
        getFaction: mockGetFaction as GetFactionFunc,
      } as IGameState,
      controller: {
        removeFaction: mockRemoveFaction as (id:string)=>void,
      } as IGameController,
    }}>
      <MemoryRouter initialEntries={[route]}>
        <TestComp />
      </MemoryRouter>
    </GameContext.Provider>
  );
}

describe('FactionListActionToolbar', () => {
  it('renders buttons', () => {
    renderIt();
    const box = screen.getByTestId("faction-list-action-toolbar");
    expect(box).toBeInTheDocument();
    const btnAdd = within(box).getByTestId("lat-add");
    expect(btnAdd).toBeInTheDocument();
    expect(btnAdd).not.toBeDisabled();
    const btnRemove = within(box).getByTestId("lat-remove");
    expect(btnRemove).toBeInTheDocument();
    expect(btnRemove).toBeDisabled();
  });

  it('remove button is enabled when faction selected', () => {
    mockGetFaction.mockImplementationOnce(() => ({} as FactionInfo));
    renderIt("/factions/test-faction");
    const loc = screen.getByTestId("test-path");
    expect(loc.textContent).toBe("/factions/test-faction");
    const btnRemove = screen.getByTestId("lat-remove");
    expect(btnRemove).not.toBeDisabled();
  });

  it.todo("add button shows AddFactionDialog");
  it.todo("AddFactionDialog calls controller after faction added");
  
  it("remove button shows RemoveFactionDialog and removes faction when confirmed", async () => {
    mockGetFaction.mockImplementation(() => ({
      id: "test-faction",
    } as FactionInfo));
    renderIt("/factions/test-faction");
    const btnRemove = screen.getByTestId("lat-remove");
    expect(btnRemove).not.toBeDisabled();
    let dialog = screen.queryByTestId("delete-faction-confirmation");
    expect(dialog).not.toBeInTheDocument();
    fireEvent.click(btnRemove);
    
    dialog = screen.getByTestId("delete-faction-confirmation");
    expect(dialog).toBeInTheDocument();
    const btnConfirm = within(dialog).getByText("Remove");
    expect(btnConfirm).toBeInstanceOf(HTMLButtonElement);
    fireEvent.click(btnConfirm);

    await waitFor(() => expect(mockRemoveFaction).toBeCalledTimes(1));
    expect(mockRemoveFaction).toBeCalledWith("test-faction");
    const loc = screen.getByTestId("test-path");
    expect(loc.textContent).toBe("/factions");
  });
});
