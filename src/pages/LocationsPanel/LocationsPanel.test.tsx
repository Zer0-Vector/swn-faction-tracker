import React from "react";
import { MemoryRouter } from "react-router-dom";

import { render, screen } from "@testing-library/react";

import { GameContext } from "../../contexts/GameContext";
import { IGameController } from "../../controllers/GameController";
import LocationInfo from "../../types/LocationInfo";
import { IGameState } from "../../types/RuntimeGameState";

import LocationsPanel from "./LocationsPanel";

function renderIt(locations: LocationInfo[] = []) {
  render(
    <GameContext.Provider value={{
      state: {
        getLocations: () => locations,
        checkLocationName: (s: string) => true,
      } as IGameState,
      controller: {} as IGameController,
    }}>
      <MemoryRouter>
        <LocationsPanel />
      </MemoryRouter>
    </GameContext.Provider>
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
