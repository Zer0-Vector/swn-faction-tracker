import React from "react";
import { MemoryRouter } from "react-router-dom";

import { render, screen } from "@testing-library/react";

import { LocationContext, LocationsPoset } from "../../contexts/LocationContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import { UiStateController } from "../../controllers/UiStateController";
import LocationInfo from "../../types/LocationInfo";

import LocationsPanel from "./LocationsPanel";

function renderIt(locations: LocationInfo[] = []) {
  render(
    <LocationContext.Provider value={{
      locations: {
        getAll: () => locations,
        checkName: (s: Parameters<LocationsPoset['checkName']>[0]) => true,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        subscribe: (_) => () => {},
      } as LocationsPoset,
    }}>
      <UiStateContext.Provider value={{
        state: {
          editMode: "EDIT",
          loginState: "LOGGED_IN",
        },
        controller: {} as UiStateController,
      }}>
        <MemoryRouter>
          <LocationsPanel />
        </MemoryRouter>
      </UiStateContext.Provider>
    </LocationContext.Provider>
  );
}

describe('default LocationsPanel', () => {
  it('empty LocationsPanel shows LocationActionsToolbar', () => {
    renderIt();
    const lat = screen.getByTestId("locations-action-toolbar");
    expect(lat).toBeInTheDocument();
    const list = screen.queryByTestId("locations-list-container");
    expect(list).not.toBeInTheDocument();
  });

  it('nonempty LocationsPanel shows LocationActionsToolbar and LocationsList', () => {
    renderIt([
      {
        id: "test",
        slug: "test",
        name: "test",
        tl: 1,
        x: 2,
        y: 3,
      },
    ]);
    const lat = screen.getByTestId("locations-action-toolbar");
    expect(lat).toBeInTheDocument();
    const list = screen.getByTestId("locations-list-container");
    expect(list).toBeInTheDocument();
  });
});
