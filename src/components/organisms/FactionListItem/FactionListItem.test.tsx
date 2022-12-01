import React from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import * as RouterDom from "react-router-dom";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import { Maybe } from "../../../types/Maybe";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionListItem from "./FactionListItem";

jest.mock("react-router-dom");

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

const mockUseNavigate = RouterDom.useNavigate as jest.MockedFn<typeof RouterDom.useNavigate>;
const mockUseLocation = RouterDom.useLocation as jest.MockedFn<typeof RouterDom.useLocation>;

const mockFaction: FactionInfo = {
  id: "test-faction",
  name: "Test Faction",
  stats: {
    cunning: 0,
    force: 1,
    hp: 2,
    maxHp: 3,
    wealth: 4,
    xp: 5,
  },
};

function renderIt() {
  render(
    <GameContext.Provider value={mockContext}>
      <FactionListItem
        dragHandleProps={{} as DraggableProvidedDragHandleProps}
        faction={mockFaction}
        isDragging={false}
      />
    </GameContext.Provider>
  );
}

describe('FactionListItem', () => {
  beforeEach(() => {
    mockUseNavigate.mockImplementationOnce(() => {
      return () => { /* NOP */ };
    });
    mockUseLocation.mockImplementation(() => {
      return {
        pathname: "/factions",
      } as RouterDom.Location;
    });
    mockGetFaction.mockImplementationOnce(() => {
      return mockFaction;
    });
  });

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
  const mockNav = jest.fn();
  beforeEach(() => {
    mockUseNavigate.mockImplementationOnce(() => {
      return mockNav;
    });
    mockUseLocation.mockImplementation(() => {
      return {
        pathname: "/factions",
      } as RouterDom.Location;
    });
    mockGetFaction.mockImplementationOnce(() => {
      return mockFaction;
    });
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

  it('clicking on the faction row selects it', () => {
    renderIt();
    const col = screen.getByTestId("faction-list-item-name-col");
    const name = within(col).getByTestId("faction-list-item-name");
    fireEvent.click(name);
    expect(mockNav).toBeCalledWith("/factions/test-faction");
  });
});
