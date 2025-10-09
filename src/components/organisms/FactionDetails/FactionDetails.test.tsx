import React from "react";

import { render, screen, waitFor, within } from "@testing-library/react";

import { userEvent } from "@testing-library/user-event";

import { FactionContext, FactionContextType, FactionPoset } from "../../../contexts/FactionContext";
import { LocationContext, LocationContextType, LocationsPoset } from "../../../contexts/LocationContext";
import FactionInfo from "../../../utils/FactionInfo";

import FactionDetails from "./FactionDetails";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LocationInfo from "../../../utils/LocationInfo";
import { UiStateContext, UiStateContextType } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import UiState from "../../../types/UiState";

const DEBUG_MODE = true;

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

let mockLocation1: LocationInfo
let mockLocation2: LocationInfo;

describe('default FactionDetails', () => {
  beforeAll(() => {
    mockLocation1 = mockLocationContext.locations.add({
      name: "Test Location 1",
      tl: 0, x: 0, y: 0
    });
    mockLocation2 = mockLocationContext.locations.add({
      name: "Test Location 2",
      tl: 1, x: 1, y: 1
    });
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

  beforeEach(() => {
    console.log("mocked FactionInfo: ", mockContext.factions.get(mockFaction.id));
    console.log("mockContext.factions.size: ", mockContext.factions.size);
  });

  afterEach(() => {
    vi.resetAllMocks();
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
    const child = within(item).getByTestId("homeworld");
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
    const child = within(item).getByTestId("tag");
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
    expect(maxhp).toHaveTextContent("16");
  });

  it('renders attributes', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("attr-label");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toEqual("Force/Cunning/Wealth:");
    const item = within(container).getByTestId("attr-item");
    expect(item).toBeInTheDocument();

    const force = within(item).getByTestId("faction-force");
    expect(force).toBeInTheDocument();
    expect(force).toHaveTextContent("2");

    const cunning = within(item).getByTestId("faction-cunning");
    expect(cunning).toBeInTheDocument();
    expect(cunning).toHaveTextContent("1");

    const wealth = within(item).getByTestId("faction-wealth");
    expect(wealth).toBeInTheDocument();
    expect(wealth).toHaveTextContent("5");
  });

  it('renders goal', () => {
    renderIt();
    const container = screen.getByTestId("faction-details");
    const header = within(container).getByTestId("goal-label");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toEqual("Goal:");

    const item = within(container).getByTestId("goal-item");
    expect(item).toBeInTheDocument();

    const hp = within(item).getByTestId("goal-text");
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

    const tally = within(item).getByTestId("goal-progress-empty");
    expect(tally).toBeInTheDocument();
    expect(tally).toHaveTextContent("Select Goal");
  });

  describe('FactionDetails with homeworld set', { timeout: 10000 },  () => {
    beforeAll(() => {
      mockContext.factions.update(mockFaction.id, "homeworldId", mockLocation1.id);
    });

    afterAll(() => {
      mockContext.factions.update(mockFaction.id, "homeworldId", undefined);
    })

    afterEach(() => {
      vi.clearAllMocks();
    });

    function setupHomeworldComponent() {
      const result = renderIt();
      const container = screen.getByTestId("faction-details");
      const header = within(container).getByTestId("homeworld-label");
      expect(header).toBeInTheDocument();
      expect(header.textContent).toEqual("Homeworld:");
      const item = within(container).getByTestId("homeworld-item");
      expect(item).toBeInTheDocument();
      const child = within(item).getByTestId("homeworld");
      expect(child).toBeInTheDocument();
      return { homeworldComponent: child, ...result };
    }

    it("renders homeworld name", () => {
      const { homeworldComponent } = setupHomeworldComponent();
      expect(homeworldComponent).toHaveTextContent(mockLocation1.name);
    });

    it("edits homeworld name", async () => {
      const { homeworldComponent: hc, user } = setupHomeworldComponent();
      expect(hc).toHaveTextContent(mockLocation1.name);

      const getTextElement = () => within(hc).queryByTestId("editable-dropdown-text");
      const getFieldElement = () => within(hc).queryByTestId("editable-dropdown-textfield");

      expect(getTextElement()).toBeInTheDocument();
      expect(getFieldElement()).not.toBeInTheDocument();

      const button = within(hc).getByTestId("editable-dropdown-button");
      await user.click(button);

      expect(getTextElement()).not.toBeInTheDocument();
      const field = getFieldElement();
      expect(field).toBeInTheDocument();

      const listbox = within(hc).getByRole("listbox");
      expect(listbox).toBeInTheDocument();
      const options = within(listbox).getAllByRole("option");
      expect(options.length).toBe(2);

      const selection = options.find(opt => opt.textContent === mockLocation2.name);
      expect(selection).not.toBeUndefined();
      expect(selection).toHaveTextContent(mockLocation2.name);
      await user.click(selection!);

      await waitFor(() => expect(listbox).not.toBeInTheDocument());

      expect(getTextElement()).toBeInTheDocument();
      expect(getTextElement()).toHaveTextContent(mockLocation2.name);

    });

  });

  describe('FactionDetails with goal set', () => {
    it.todo("renders goal");
    it.todo("updates goal on edit");
  });

});
