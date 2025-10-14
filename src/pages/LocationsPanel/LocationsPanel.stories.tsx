import React, { useMemo } from "react";
import { MemoryRouter } from "react-router-dom";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  LocationContext,
  LocationsPoset,
} from "../../contexts/LocationContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import { UiStateController } from "../../controllers/UiStateController";
import { RequiredChildrenProps } from "../../types/ChildrenProps";
import LocationInfo from "../../utils/LocationInfo";
import UiState from "../../types/UiState";
import { generateSlug } from "../../utils/SlugGenerator";

import LocationsPanel from "./LocationsPanel";

interface MockProviderProps extends RequiredChildrenProps {
  locations: LocationsPoset;
}

const MockProvider = ({ children, locations }: MockProviderProps) => {
  const context = useMemo(() => ({ locations }), [locations]);
  return (
    <LocationContext.Provider value={context}>
      {children}
    </LocationContext.Provider>
  );
};

const locations: LocationInfo[] = [
  {
    id: "test-1",
    slug: "test-loc-1",
    name: "Test Loc 1",
    tl: 1,
    x: 0,
    y: 1,
  },
  {
    id: "test-2",
    slug: "test-loc-2",
    name: "Test Loc 2 has a Medium Length Name",
    tl: 2,
    x: 2,
    y: 3,
  },
  {
    id: "test-3",
    slug: "test-loc-3",
    name: "Test Loc 3 has a Really Long Name That Continues On and On For a Long Time",
    tl: 3,
    x: 4,
    y: 5,
  },
];

const getLocationsPoset = (locations: LocationInfo[]) =>
  ({
    getAll() {
      return locations;
    },
    slugGet(locationSlug) {
      return locations.find((v) => v.slug === locationSlug);
    },
    checkName(args) {
      return !locations.map((l) => l.slug).includes(generateSlug(args.name));
    },
    add(info) {
      action("add")(info);
    },
    reorder(source, destination?) {
      action("reorder")(source, destination);
    },
    remove(selectedLocation) {
      action("remove")(selectedLocation);
    },
    update(id, key, value) {
      action("update")(id, key, value);
    },
    subscribe(...args) {
      action("subscribe")(args);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    },
  }) as LocationsPoset;

export default {
  component: LocationsPanel,
  decorators: [
    (story) => <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>,
    (story) => (
      <UiStateContext.Provider
        value={{
          state: {
            editMode: "EDIT",
          } as UiState,
          controller: {} as UiStateController,
        }}
      >
        {story()}
      </UiStateContext.Provider>
    ),
  ],
} as ComponentMeta<typeof LocationsPanel>;

const Template: ComponentStory<typeof LocationsPanel> = () => (
  <LocationsPanel />
);

export const Default = Template.bind({});
Default.decorators = [
  (story) => (
    <MockProvider locations={getLocationsPoset(locations)}>
      {story()}
    </MockProvider>
  ),
];

export const Empty = Template.bind({});
Empty.decorators = [
  (story) => (
    <MockProvider locations={getLocationsPoset([])}>{story()}</MockProvider>
  ),
];
