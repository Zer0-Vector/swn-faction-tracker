import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import { IGameState } from "../../../types/RuntimeGameState";
import UiState from "../../../types/UiState";
import { generateSlug } from "../../../utils/SlugGenerator";
import { MockActionController } from "../../__mocks__/MockActionController";

import LocationsActionToolbar from "./LocationsActionToolbar";

const MockLocations = [
  {
    id: "test-location",
    name: "Test Location",
  },
];

export default {
  component: LocationsActionToolbar,
  decorators: [
    story => (
      <GameContext.Provider value={{
        controller: MockActionController,
        state: {
          getLocations() {
            return MockLocations;
          },
          getLocation(locationId) {
            return MockLocations.find(loc => loc.id === locationId);
          },
          checkLocationName(locationName) {
            return !MockLocations.map(l => l.id).includes(generateSlug(locationName));
          },
        } as IGameState,
      }}>
        {story()}
      </GameContext.Provider>
    ),
    story => <UiStateContext.Provider value={{
      state: {
        editMode: "EDIT",
      } as UiState,
      controller: {} as UiStateController,
    }}>
      {story()}
    </UiStateContext.Provider>,
  ],
} as ComponentMeta<typeof LocationsActionToolbar>;

const Template: ComponentStory<typeof LocationsActionToolbar> = () => <LocationsActionToolbar />;

export const Default = Template.bind({});
Default.decorators = [
  story => (
    <MemoryRouter>
      {story()}
    </MemoryRouter>
  ),
];

export const Removable = Template.bind({});
Removable.decorators = [
  story => (
    <MemoryRouter
      initialEntries={["/locations/test-location"]}
      initialIndex={0}
    >
      {story()}
    </MemoryRouter>
  ),
];
