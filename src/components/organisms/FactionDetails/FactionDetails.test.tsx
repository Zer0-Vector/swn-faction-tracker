import React from "react";

import { render, screen, within } from "@testing-library/react";

import { userEvent } from "@testing-library/user-event";

import { FactionContext, FactionContextType, FactionPoset } from "../../../contexts/FactionContext";
import { LocationContext, LocationContextType, LocationsPoset } from "../../../contexts/LocationContext";
import FactionInfo from "../../../utils/FactionInfo";

import FactionDetails from "./FactionDetails";
import { describe, expect, it, vi } from "vitest";
import { UiStateContext, UiStateContextType } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import UiState from "../../../types/UiState";


let mockFaction: FactionInfo;

const mockLocationContext: LocationContextType = {
  locations: new LocationsPoset(),
};

const mockContext: FactionContextType = {
  factions: new FactionPoset(),
};

const mockSetUiState = vi.fn();
const mockUiStateContext: UiStateContextType = (() => {
  const state: UiState = {
    editMode: "EDIT",
    loginState: "LOGGED_OUT",
    turnIndex: 0,
    turnState: "OFF",
    turnInfo: undefined
  };
  const ctx = {
    state,
    controller: new UiStateController(mockSetUiState),
  };

  mockSetUiState.mockImplementation((uiState) => {
    ctx.state = uiState;
  });

  return ctx;
})();

let mockFactionId;

function renderIt() {
  return {
    user: userEvent.setup({ delay: 500, }),
    ...render(
      <UiStateContext.Provider value={mockUiStateContext}>
        <LocationContext.Provider value={mockLocationContext}>
          <FactionContext.Provider value={mockContext}>
            <FactionDetails faction={mockFaction} />
          </FactionContext.Provider>
        </LocationContext.Provider>
      </UiStateContext.Provider>
    )
  }
}


describe('default FactionDetails', () => {
  beforeAll(() => {
    const faction = mockContext.factions.add({
      name: "Test Faction",
    });
    const fid = faction.id;
    mockContext.factions.update(fid, "cunning", 1);
    mockContext.factions.update(fid, "force", 2);
    mockContext.factions.update(fid, "hp", 33);
    mockContext.factions.update(fid, "wealth", 5);
    mockContext.factions.update(fid, "xp", 66);
    mockFaction = mockContext.factions.get(fid)!;
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
    const item = within(container).getByTestId("homeworld-item");
    expect(item).toBeInTheDocument();
  });

  it('renders tag', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("tag-label");
    expect(header).toBeInTheDocument();
    const item = within(container).getByTestId("tag-item");
    expect(item).toBeInTheDocument();
    const child = within(item).getByTestId("tag");
    expect(child).toBeInTheDocument();
  });

  it('renders hp', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("hp-label");
    expect(header).toBeInTheDocument();
    const item = within(container).getByTestId("hp-item");
    expect(item).toBeInTheDocument();
    const hp = within(item).getByTestId("hp");
    expect(hp).toBeInTheDocument();
    const maxhp = within(item).getByTestId("maxhp");
    expect(maxhp).toBeInTheDocument();
  });

  it('renders attributes', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("attr-label");
    expect(header).toBeInTheDocument();
    const item = within(container).getByTestId("attr-item");
    expect(item).toBeInTheDocument();

    const force = within(item).getByTestId("faction-force");
    expect(force).toBeInTheDocument();

    const cunning = within(item).getByTestId("faction-cunning");
    expect(cunning).toBeInTheDocument();

    const wealth = within(item).getByTestId("faction-wealth");
    expect(wealth).toBeInTheDocument();
  });

  it('renders goal', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("goal-label");
    expect(header).toBeInTheDocument();

    const item = within(container).getByTestId("goal-item");
    expect(item).toBeInTheDocument();

    const hp = within(item).getByTestId("goal-text");
    expect(hp).toBeInTheDocument();
  });

  it('renders progress', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("goal-progress-label");
    expect(header).toBeInTheDocument();

    const item = within(container).getByTestId("goal-progress-item");
    expect(item).toBeInTheDocument();

    const tally = within(item).getByTestId("goal-progress-empty");
    expect(tally).toBeInTheDocument();
  });

});
