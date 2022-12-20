import React from "react";
import { MemoryRouter } from "react-router-dom";

import { Meta, Story } from "@storybook/react";

import { LocationContext, LocationsPoset } from "../../../contexts/LocationContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import LocationInfo from "../../../types/LocationInfo";
import { ExtendedStoryProps } from "../../__mocks__/ExtendedStoryProps";

import LocationsList from "./LocationsList";
import { action } from "@storybook/addon-actions";

const MockLocations: (n: number)=>LocationInfo[] = numLocations => 
  [...Array(numLocations).keys()]
  .map(n => ({
    id: "test",
    slug: `test-location-${n}`,
    name: `Test Location ${n}`,
    tl: n % 6,
    x: n % 10,
    y: n % 8,
  }));

// eslint-disable-next-line react/display-name
const getContextProvider = (numberOfLocations: number) => ({ children }: RequiredChildrenProps) => {
  const locations = MockLocations(numberOfLocations);
  return (
    <LocationContext.Provider value={{
      locations: {
        getAll: () => locations,
        get: (locationId) => locations.find(loc => loc.slug === locationId),
        reorder: (...args) => action("reorder")(args),
      } as LocationsPoset,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

interface AdditionalArgs {
  numberOfLocations: number;
}

type StoryProps = ExtendedStoryProps<typeof LocationsList, AdditionalArgs>;

export default {
  component: LocationsList,
  argTypes: {
    numberOfLocations: {
      name: "Number of Locations",
      type: {
        name: "number",
        required: true,
      },
    },
  },
} as Meta<StoryProps>;

const Template: Story<StoryProps> = args => {
  const Provider = getContextProvider(args.numberOfLocations);
  return (
    <Provider>
      <LocationsList />
    </Provider>
  );
};

export const Default = Template.bind({});
Default.args = {
  numberOfLocations: 5,
};
Default.decorators = [
  story => (
    <MemoryRouter>
      {story()}
    </MemoryRouter>
  ),
];

export const Selected = Template.bind({});
Selected.args = {
  numberOfLocations: 4,
};
Selected.decorators = [
  story => (
    <MemoryRouter
      initialEntries={["/locations/test-location-1", "/locations"]}
      initialIndex={0}
    >
      {story()}
    </MemoryRouter>
  ),
];
