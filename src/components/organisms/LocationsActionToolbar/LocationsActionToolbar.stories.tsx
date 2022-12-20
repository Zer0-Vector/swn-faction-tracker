import React from "react";
import { MemoryRouter } from "react-router-dom";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { LocationContext, LocationsPoset } from "../../../contexts/LocationContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import UiState from "../../../types/UiState";
import { generateSlug } from "../../../utils/SlugGenerator";

import LocationsActionToolbar from "./LocationsActionToolbar";

const MockLocations = [
  {
    id: "123456",
    slug: "test-location",
    name: "Test Location",
  },
];

export default {
  component: LocationsActionToolbar,
  decorators: [
    story => (
      <LocationContext.Provider value={{
        locations: {
          getAll() {
            return MockLocations;
          },
          slugGet(locationSlug) {
            return MockLocations.find(loc => loc.slug === locationSlug);
          },
          checkName(args) {
            return !MockLocations.map(l => l.id).includes(generateSlug(args.name));
          },
          remove(...args) {
            action("remove")(args);
          },
        } as LocationsPoset,
      }}>
        {story()}
      </LocationContext.Provider>
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
