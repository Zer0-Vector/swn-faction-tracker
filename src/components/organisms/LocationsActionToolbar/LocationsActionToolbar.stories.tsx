import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameState } from "../../../types/RuntimeGameState";
import { generateId } from "../../../utils/IdGenerator";
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
            return !MockLocations.map(l => l.id).includes(generateId(locationName));
          },
        } as IGameState,
      }}>
        {story()}
      </GameContext.Provider>
    ),
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
