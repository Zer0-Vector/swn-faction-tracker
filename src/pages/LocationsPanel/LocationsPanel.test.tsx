import React, { act } from "react";
import { MemoryRouter } from "react-router-dom";

import { render, screen } from "@testing-library/react";

import {
  LocationContext,
  LocationsPoset,
} from "../../contexts/LocationContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import { UiStateController } from "../../controllers/UiStateController";
import LocationInfo from "../../utils/LocationInfo";
import UiState from "../../types/UiState";

import LocationsPanel from "./LocationsPanel";
import { describe, expect, it, vi } from "vitest";

async function renderIt(locations: LocationInfo[] = []) {
  const result = await act(
    async () => render(
      <LocationContext.Provider
        value={{
          locations: {
            getAll: () => locations,
            checkName: (s: Parameters<LocationsPoset["checkName"]>[0]) => true,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            subscribe: (_) => () => { },
            reorder: vi.fn() as LocationsPoset["reorder"],
          } as LocationsPoset,
        }}
      >
        <UiStateContext.Provider
          value={{
            state: {
              editMode: "EDIT",
              loginState: "LOGGED_IN",
            } as UiState,
            controller: {} as UiStateController,
          }}
        >
          <MemoryRouter>
            <LocationsPanel />
          </MemoryRouter>
        </UiStateContext.Provider>
      </LocationContext.Provider>
    )
  );

  await yieldToEventLoop(1000);

  return result;
}

describe("default LocationsPanel", () => {
  it("empty LocationsPanel shows LocationActionsToolbar", async () => {
    await renderIt();
    const lat = await screen.findByTestId("locations-action-toolbar");
    expect(lat).toBeInTheDocument();
    const list = screen.queryByTestId("locations-list-container");
    expect(list).not.toBeInTheDocument();
  });

  it("nonempty LocationsPanel shows LocationActionsToolbar and LocationsList", async () => {
    await renderIt([
      {
        id: "test",
        slug: "test",
        name: "test",
        tl: 1,
        x: 2,
        y: 3,
      },
    ]);
    const lat = await screen.findByTestId("locations-action-toolbar");
    expect(lat).toBeInTheDocument();
    const list = screen.getByTestId("locations-list-container");
    expect(list).toBeInTheDocument();
  });
});
