import React from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { BrowserRouter } from "react-router-dom";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { FactionContext, FactionContextType, FactionPoset } from "../../../contexts/FactionContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import FactionInfo from "../../../types/FactionInfo";
import UiState from "../../../types/UiState";

import FactionListItem from "./FactionListItem";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetFaction = vi.fn();
const mockUpdateFaction = vi.fn();
const mockCheckName = vi.fn();
const mockContext: FactionContextType = {
  factions: {
    slugGet: mockGetFaction as FactionPoset['get'],
    getAll: vi.fn() as FactionPoset['getAll'],
    update: mockUpdateFaction as FactionPoset['update'],
    checkName: mockCheckName as FactionPoset['checkName'],
  } as FactionPoset,
};

const mockFaction: FactionInfo = {
  id: "test",
  slug: "test-faction",
  name: "Test Faction",
  cunning: 0,
  force: 1,
  hp: 2,
  maxHp: 3,
  wealth: 4,
  xp: 5,
};

function renderIt() {
  render(
    <UiStateContext.Provider value={{
      state: {
        editMode: "EDIT",
        loginState: "LOGGED_IN",
      } as UiState,
      controller: {} as UiStateController,
    }}>
      <FactionContext.Provider value={mockContext}>
        <FactionListItem
          dragHandleProps={{} as DraggableProvidedDragHandleProps}
          faction={mockFaction}
          isDragging={false}
        />
      </FactionContext.Provider>
    </UiStateContext.Provider>,
    { wrapper: BrowserRouter }
  );
}

describe('FactionListItem', () => {
  it('renders item container', () => {
    renderIt();
    const listItem = screen.getByTestId("faction-list-item");
    expect(listItem).toBeInTheDocument();
  });

  it('renders drag handle', () => {
    renderIt();
    const col = screen.getByTestId("faction-list-item-drag-handle-col");
    expect(col).toBeInTheDocument();
    const icon = within(col).getByTestId("DragHandleIcon");
    expect(icon).toBeInTheDocument();
    expect(icon).toBeInstanceOf(SVGElement);
  });

  it('renders name', () => {
    renderIt();
    const col = screen.getByTestId("faction-list-item-name-col");
    expect(col).toBeInTheDocument();
    const name = within(col).getByTestId("faction-list-item-name");
    expect(name).toBeInTheDocument();
    expect(name).toHaveTextContent(mockFaction.name);
  });

  it('renders health bar', () => {
    renderIt();
    const col = screen.getByTestId("faction-list-item-health-col");
    expect(col).toBeInTheDocument();
    const bar = within(col).getByRole("progressbar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveClass("MuiLinearProgress-root");
    expect(bar).toHaveClass("MuiLinearProgress-colorError");
  });

  it('renders attributes', () => {
    renderIt();
    const col = screen.getByTestId("faction-list-item-attributes-col");
    expect(col).toBeInTheDocument();

    const force = within(col).getByTestId("faction-force");
    expect(force).toBeInTheDocument();
    expect(force).toHaveTextContent("1");

    const cunning = within(col).getByTestId("faction-cunning");
    expect(cunning).toBeInTheDocument();
    expect(cunning).toHaveTextContent("0");

    const wealth = within(col).getByTestId("faction-wealth");
    expect(wealth).toBeInTheDocument();
    expect(wealth).toHaveTextContent("4");
  });
});

describe('FactionListItem behaviors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, "", "/");
    mockCheckName.mockImplementation(() => true);
  });

  it('editing the faction name calls controller', async () => {
    mockGetFaction.mockImplementation((id: string) => mockFaction);
    renderIt();
    const col = screen.getByTestId("faction-list-item-name-col");
    const name = within(col).getByTestId("faction-list-item-name");
    const button = within(name).getByTestId("editable-text-button");
    fireEvent.click(button);

    const textfield = within(name).getByTestId("editable-text-textfield");
    // eslint-disable-next-line testing-library/no-node-access
    const textInput = textfield.querySelector("input") as HTMLInputElement;
    expect(textInput).toBeInTheDocument();
    expect(textInput).toHaveValue("Test Faction");
    fireEvent.change(textInput, { target: { value: "blah" } });
    fireEvent.keyUp(textInput, { key: 'Enter' });
    await waitFor(() => expect(mockUpdateFaction).toBeCalledTimes(1));
    expect(mockUpdateFaction).toBeCalledWith("test", "name", "blah");
  });

  it('editing a selected name redirect to new name', async () => {
    mockGetFaction.mockImplementation((id: string) => mockFaction);
    mockUpdateFaction.mockImplementationOnce(() => ({ id: "123", name: "blah", slug: "blah" }));
    renderIt();
    expect(window.location.pathname).toBe("/");
    const col = screen.getByTestId("faction-list-item-name-col");
    const name = within(col).getByTestId("faction-list-item-name");
    fireEvent.click(name);
    expect(window.location.pathname).toBe("/factions/test-faction");

    const button = within(name).getByTestId("editable-text-button");
    fireEvent.click(button);

    const textfield = within(name).getByTestId("editable-text-textfield");
    // eslint-disable-next-line testing-library/no-node-access
    const textInput = textfield.querySelector("input") as HTMLInputElement;
    fireEvent.change(textInput, { target: { value: "blah" } });
    fireEvent.keyUp(textInput, { key: 'Enter' });
    await waitFor(() => expect(mockUpdateFaction).toBeCalledTimes(1));
    expect(mockUpdateFaction).toBeCalledWith("test", "name", "blah");
    expect(window.location.pathname).toBe("/factions/blah");
  });

  it('clicking on the faction row selects it, the deselects it', () => {
    renderIt();
    const col = screen.getByTestId("faction-list-item-name-col");
    const name = within(col).getByTestId("faction-list-item-name");
    fireEvent.click(name);
    expect(window.location.pathname).toBe("/factions/test-faction");
    // TODO: expect list item to be selected
    fireEvent.click(name);
    expect(window.location.pathname).toBe("/factions");
  });
});
