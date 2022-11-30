import React from "react";
import { MemoryRouter } from "react-router-dom";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { MockAction } from "../../components/__tests__/MockAction";
import { GameContext } from "../../contexts/GameContext";
import { IGameController } from "../../controllers/GameController";
import FactionInfo from "../../types/FactionInfo";
import PurchasedAsset from "../../types/PurchasedAsset";
import { IGameState } from "../../types/RuntimeGameState";

import PrimaryPanel from "./PrimaryPanel";

export default {
  component: PrimaryPanel,
  decorators: [
    story => (
      <MemoryRouter>
        {story()}
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof PrimaryPanel>;

const factions: FactionInfo[] = [
  {
    id: "test-faction-1",
    name: "Test Faction 1",
    stats: {
      cunning: 1,
      force: 2,
      hp: 3,
      maxHp: 4,
      wealth: 5,
      xp: 6,
    }
  },
  {
    id: "test-faction-2",
    name: "Test Faction 2",
    stats: {
      cunning: 1,
      force: 2,
      hp: 3,
      maxHp: 4,
      wealth: 5,
      xp: 6,
    }
  },
  {
    id: "test-faction-3",
    name: "Test Faction 3",
    stats: {
      cunning: 1,
      force: 2,
      hp: 3,
      maxHp: 4,
      wealth: 5,
      xp: 6,
    }
  },
];

const getMockedState = (factions: FactionInfo[] = [], assetMap: { [id: string]: PurchasedAsset[] } = {}) => ({
  getFactions() {
    return factions;
  },
  getFaction(factionId) {
    return factions.find(f => f.id === factionId);
  },
  getLocations() {
    return [
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
  },
  getAssets(factionId) {
    if (factionId === undefined || assetMap[factionId] === undefined) {
      return [];
    }
    return assetMap[factionId];
  },
} as IGameState);

const MockProvider = ({ children, state }: { children: React.ReactNode, state: IGameState }) => (
  <GameContext.Provider value={{
    state,
    controller: {
      ...MockAction("reorderFactions"),
      ...MockAction("updateFactionName"),
      ...MockAction("addFaction"),
      ...MockAction("removeFaction"),
      ...MockAction("addAsset"),
      ...MockAction("updateHp"),
      ...MockAction("updateForce"),
      ...MockAction("setGoal"),
      ...MockAction("updateCunning"),
      ...MockAction("updateWealth"),
      ...MockAction("updateHomeworld"),
      ...MockAction("removeAsset"),
    } as unknown as IGameController,
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