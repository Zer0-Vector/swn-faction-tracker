import React from "react";

import { render, screen, within } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import LocationInfo from "../../../types/LocationInfo";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionDetails from "./FactionDetails";

let mockFaction: FactionInfo;

const mockGetLocations = jest.fn();
const mockGetFaction = jest.fn();

const mockContext: GameContextType = {
  state: {
    getLocations: mockGetLocations as ()=>LocationInfo[],
    getFaction: mockGetFaction as (fid: string)=>FactionInfo,
  } as IGameState,
  controller: {} as IGameController,
};

function renderIt() {
  render(
    <GameContext.Provider value={mockContext}>
      <FactionDetails faction={mockFaction} />
    </GameContext.Provider>
  );
}

describe('default FactionDetails', () => {
  beforeEach(() => {
    mockFaction = {
      id: "test-faction",
      name: "Test Faction",
      stats: {
        cunning: 11,
        force: 22,
        hp: 33,
        maxHp: 44,
        wealth: 55,
        xp: 66,
      },
    };
    mockGetLocations.mockImplementation(() => [
      {
        id: "test-location-1",
        name: "Test Location 1",
        tl: 0,
        x: 0, y: 0,
      },
      {
        id: "test-location-2",
        name: "Test Location 2",
        tl: 1, 
        x: 1, y: 1,
      }
    ]);
    mockGetFaction.mockImplementation((f: string) => {
      if (f !== mockFaction.id) {
        throw new Error("Need more mocking");
      }
      return mockFaction;
    });
  });

  afterEach(() => {
    mockGetFaction.mockClear();
    mockGetLocations.mockClear();
  });

  it('renders container', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    expect(container).toBeInTheDocument();
    expect(container).not.toBeEmptyDOMElement();
  });

  it('renders homeworld', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("homeworld-label");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toEqual("Homeworld:");
    const item = within(container).getByTestId("homeworld-item");
    expect(item).toBeInTheDocument();
    const child = within(item).getByTestId("editable-name-text-text");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Unknown");
  });

  it('renders tag', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("tag-label");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toEqual("Tag:");
    const item = within(container).getByTestId("tag-item");
    expect(item).toBeInTheDocument();
    const child = within(item).getByTestId("editable-name-text-text");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Unknown");
  });

  it('renders hp', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("hp-label");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toEqual("HP:");
    const item = within(container).getByTestId("hp-item");
    expect(item).toBeInTheDocument();
    const hp = within(item).getByTestId("hp");
    expect(hp).toBeInTheDocument();
    expect(hp).toHaveTextContent("33");
    
    const maxhp = within(item).getByTestId("maxhp");
    expect(maxhp).toBeInTheDocument();
    expect(maxhp).toHaveTextContent("44");
  });

  it('renders attributes', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("attr-label");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toEqual("F/C/W:");
    const item = within(container).getByTestId("attr-item");
    expect(item).toBeInTheDocument();

    const force = within(item).getByTestId("faction-force");
    expect(force).toBeInTheDocument();
    expect(force).toHaveTextContent("22");
    
    const cunning = within(item).getByTestId("faction-cunning");
    expect(cunning).toBeInTheDocument();
    expect(cunning).toHaveTextContent("11");
    
    const wealth = within(item).getByTestId("faction-wealth");
    expect(wealth).toBeInTheDocument();
    expect(wealth).toHaveTextContent("55");
  });

  it('renders goal', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("goal-label");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toEqual("Goal:");
    
    const item = within(container).getByTestId("goal-item");
    expect(item).toBeInTheDocument();
    
    const hp = within(item).getByTestId("editable-name-text-text");
    expect(hp).toBeInTheDocument();
    expect(hp).toHaveTextContent("None");
  });

  it('renders progress', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("goal-progress-label");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toEqual("Progress:");
    
    const item = within(container).getByTestId("goal-progress-item");
    expect(item).toBeInTheDocument();
    
    const tally = within(item).getByTestId("goal-progress");
    expect(tally).toBeInTheDocument();
    expect(tally).toHaveTextContent("Select Goal");
  });
});

describe('FactionDetails with goal/homeworld set', () => {
  it.todo('check stuff');
});

describe('FactionDetails behavior', () => {
  it.todo('do stuff and check results');
});
