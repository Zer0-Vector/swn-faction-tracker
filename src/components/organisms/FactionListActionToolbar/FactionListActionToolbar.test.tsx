import React, { useMemo } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import FactionInfo from "../../../utils/FactionInfo";
import UiState from "../../../types/UiState";

import FactionListActionToolbar from "./FactionListActionToolbar";
import { describe, expect, it, vi } from "vitest";

function TestComp() {
  const { pathname } = useLocation();
  const mc = useMemo(() => ({
      state: {
        editMode: "EDIT",
        loginState: "LOGGED_IN",
      } as UiState,
      controller: {} as UiStateController,
    }), []);
  return (
    <UiStateContext.Provider value={mc}>
      <FactionListActionToolbar />
      <div data-testid="test-path">{pathname}</div>
    </UiStateContext.Provider>
  );
}

const mockGetFaction = vi.fn();
const mockRemoveFaction = vi.fn();
function renderIt(route = "/") {
  render(
    <FactionContext.Provider value={{
      factions: {
        getAll: () => [] as FactionInfo[],
        slugGet: mockGetFaction as FactionPoset['slugGet'],
        remove: mockRemoveFaction as FactionPoset['remove'],
        subscribe: vi.fn() as FactionPoset['subscribe'],
      } as FactionPoset,
    }}>
      <MemoryRouter initialEntries={[route]}>
        <TestComp />
      </MemoryRouter>
    </FactionContext.Provider>
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
      id: "test-1234",
      slug: "test-faction",
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
    expect(mockRemoveFaction).toBeCalledWith("test-1234");
    const loc = screen.getByTestId("test-path");
    expect(loc.textContent).toBe("/factions");
  });
});
