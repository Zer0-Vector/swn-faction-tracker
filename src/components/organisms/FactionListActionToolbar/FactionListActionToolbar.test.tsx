import React from "react";
import { MemoryRouter, useLocation } from "react-router-dom";

import { render, screen, within } from "@testing-library/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import { Maybe } from "../../../types/Maybe";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionListActionToolbar from "./FactionListActionToolbar";

function TestComp() {
  const { pathname } = useLocation();
  return (
    <>
      <FactionListActionToolbar />
      <div data-testid="test-path">{pathname}</div>
    </>
  );
}

type GetFactionFunc = (id: string) => Maybe<FactionInfo>;
const mockGetFaction = jest.fn() as jest.MockedFn<GetFactionFunc>;
function renderIt(route = "/") {
  render(
    <GameContext.Provider value={{
      state: {
        getFactions: () => [] as FactionInfo[],
        getFaction: mockGetFaction as GetFactionFunc,
      } as IGameState,
      controller: {} as IGameController,
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
  it.todo("remove button shows RemoveFactionDialog");
  it.todo("RemoveFactionDialog calls controller after remove");
  it.todo("RemoveFactionDialog redirects after remove if selected");
});
