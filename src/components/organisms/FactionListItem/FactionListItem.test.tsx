import React from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { BrowserRouter } from "react-router-dom";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { IGameController } from "../../../controllers/GameController";
import { UiStateController } from "../../../controllers/UiStateController";
import FactionInfo from "../../../types/FactionInfo";
import { Maybe } from "../../../types/Maybe";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionListItem from "./FactionListItem";

const mockGetFaction = jest.fn();
const mockUpdateFactionName = jest.fn();
const mockContext: GameContextType = {
  state: {
    getFaction: mockGetFaction as (f:string)=>FactionInfo,
    getFactions: () => [] as FactionInfo[],
  } as IGameState,
  controller: {
    updateFactionName: mockUpdateFactionName as (c:string, v:string)=>Maybe<string>,
  } as IGameController,
};

const mockFaction: FactionInfo = {
  id: "test-faction",
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
      },
      controller: {} as UiStateController,
    }}>
      <GameContext.Provider value={mockContext}>
        <FactionListItem
          dragHandleProps={{} as DraggableProvidedDragHandleProps}
          faction={mockFaction}
          isDragging={false}
        />
      </GameContext.Provider>
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
    window.history.pushState({}, "", "/");
  });

  it('editing the faction name calls controller', async () => {
    renderIt();
    const col = screen.getByTestId("faction-list-item-name-col");
    const name = within(col).getByTestId("faction-list-item-name");
    const button = within(name).getByTestId("editable-text-button");
    fireEvent.click(button);

    const textfield = within(name).getByTestId("editable-text-textfield");
    // eslint-disable-next-line testing-library/no-node-access
    const textinput = textfield.querySelector("input") as HTMLInputElement;
    expect(textinput).toBeInTheDocument();
    expect(textinput).toHaveValue("Test Faction");
    fireEvent.change(textinput, { target: { value: "blah" } });
    fireEvent.keyUp(textinput, { key: 'Enter' });
    await waitFor(() => expect(mockUpdateFactionName).toBeCalledTimes(1));
    expect(mockUpdateFactionName).toBeCalledWith("test-faction", "blah");
  });

  it('editing a selected name redirect to new name', async () => {
    mockUpdateFactionName.mockImplementationOnce(() => "blah");
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
    const textinput = textfield.querySelector("input") as HTMLInputElement;
    fireEvent.change(textinput, { target: { value: "blah" } });
    fireEvent.keyUp(textinput, { key: 'Enter' });
    await waitFor(() => expect(mockUpdateFactionName).toBeCalledTimes(1));
    expect(mockUpdateFactionName).toBeCalledWith("test-faction", "blah");
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
