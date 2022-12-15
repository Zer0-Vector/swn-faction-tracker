import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { MockActionController } from "../../components/__mocks__/MockActionController";
import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import { UiStateController } from "../../controllers/UiStateController";
import { RequiredChildrenProps } from "../../types/ChildrenProps";
import FactionInfo from "../../types/FactionInfo";
import PurchasedAsset from "../../types/PurchasedAsset";
import { IGameState } from "../../types/RuntimeGameState";
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
    slug: "test-faction-1",
    name: "Test Faction 1",
    stats: {
      cunning: 1,
      force: 2,
      hp: 3,
      maxHp: 4,
      wealth: 5,
      xp: 6,
    },
  },
  {
    slug: "test-faction-2",
    name: "Test Faction 2",
    stats: {
      cunning: 1,
      force: 2,
      hp: 3,
      maxHp: 4,
      wealth: 5,
      xp: 6,
    },
  },
  {
    slug: "test-faction-3",
    name: "Test Faction 3",
    stats: {
      cunning: 1,
      force: 2,
      hp: 3,
      maxHp: 4,
      wealth: 5,
      xp: 6,
    },
  },
];

const locations = [
  {
    id: "test-location-1",
    name: "Test Location 1",
    tl: 1,
    x: 1,
    y: 1,
  },
  {
    id: "test-location-2",
    name: "Test Location 2",
    tl: 2,
    x: 2,
    y: 2,
  },
];

const getMockedState = (factions: FactionInfo[] = [], assetMap: { [id: string]: PurchasedAsset[] } = {}) => ({
  getFactions() {
    return factions;
  },
  getFaction(factionId) {
    return factions.find(f => f.slug === factionId);
  },
  getLocations() {
    return locations;
  },
  getLocation(locationId) {
    return locations.find(loc => loc.id === locationId);
  },
  getAssets(factionId) {
    if (factionId === undefined || assetMap[factionId] === undefined) {
      return [];
    }
    return assetMap[factionId];
  },
} as IGameState);

interface MockProviderProps extends RequiredChildrenProps {
  state: IGameState;
}

const MockProvider = ({ children, state }: MockProviderProps) => (
  <GameContext.Provider value={{
    state,
    controller: MockActionController,
  }}>
    {children}
  </GameContext.Provider>
);

const Template: ComponentStory<typeof PrimaryPanel> = () => <PrimaryPanel />;

export const Default = Template.bind({});
Default.decorators = [
  story => (
    <MockProvider state={getMockedState(factions)}>
      {story()}
    </MockProvider>
  ),
];

export const Empty = Template.bind({});
Empty.decorators = [
  story => (
    <MockProvider state={getMockedState()}>
      {story()}
    </MockProvider>
  ),
];

// TODO: WithAssets
