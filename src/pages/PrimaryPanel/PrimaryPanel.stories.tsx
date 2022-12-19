import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../contexts/FactionContext";
import { LocationContext, LocationsPoset } from "../../contexts/LocationContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import { UiStateController } from "../../controllers/UiStateController";
import { RequiredChildrenProps } from "../../types/ChildrenProps";
import FactionInfo from "../../types/FactionInfo";
import LocationInfo from "../../types/LocationInfo";
import UiState from "../../types/UiState";

import PrimaryPanel from "./PrimaryPanel";

export default {
  component: PrimaryPanel,
  decorators: [
    story => (
      <MemoryRouter>
        {story()}
      </MemoryRouter>
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
} as ComponentMeta<typeof PrimaryPanel>;

const factions: FactionInfo[] = [
  {
    id: "123",
    slug: "test-faction-1",
    name: "Test Faction 1",
    cunning: 1,
    force: 2,
    hp: 3,
    maxHp: 4,
    wealth: 5,
    xp: 6,
  },
  {
    id: "234",
    slug: "test-faction-2",
    name: "Test Faction 2",
    cunning: 1,
    force: 2,
    hp: 3,
    maxHp: 4,
    wealth: 5,
    xp: 6,
  },
  {
    id: "345",
    slug: "test-faction-3",
    name: "Test Faction 3",
    cunning: 1,
    force: 2,
    hp: 3,
    maxHp: 4,
    wealth: 5,
    xp: 6,
  },
];

const locations = [
  {
    id: "test1",
    slug: "test-location-1",
    name: "Test Location 1",
    tl: 1,
    x: 1,
    y: 1,
  },
  {
    id: "test2",
    slug: "test-location-2",
    name: "Test Location 2",
    tl: 2,
    x: 2,
    y: 2,
  },
];

const getLocationPoset = (locations: LocationInfo[] = []) => ({
  getAll() {
    return locations;
  },
  get(locationId) {
    return locations.find(loc => loc.id === locationId);
  },
} as LocationsPoset);

const getFactionPoset = (factions: FactionInfo[] = []) => ({
  getAll() {
    return factions;
  },
  get(factionId) {
    return factions.find(f => f.slug === factionId);
  },
} as FactionPoset);

interface MockProviderProps extends RequiredChildrenProps {
  factions: FactionPoset;
  locations: LocationsPoset;
}

const MockProvider = ({ children, factions, locations }: MockProviderProps) => (
  <LocationContext.Provider value={{ locations }}>
    <FactionContext.Provider value={{ factions }}>
        {children}
    </FactionContext.Provider>
  </LocationContext.Provider>
);

const Template: ComponentStory<typeof PrimaryPanel> = () => <PrimaryPanel />;

export const Default = Template.bind({});
Default.decorators = [
  story => (
    <MockProvider factions={getFactionPoset(factions)} locations={getLocationPoset(locations)}>
      {story()}
    </MockProvider>
  ),
];

export const Empty = Template.bind({});
Empty.decorators = [
  story => (
    <MockProvider factions={getFactionPoset()} locations={getLocationPoset()}>
      {story()}
    </MockProvider>
  ),
];

// TODO: WithAssets
